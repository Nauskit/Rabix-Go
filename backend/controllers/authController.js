const bcrypt = require('bcrypt')
const { pool } = require("../config/db")
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const hashToken = require('../utils/hashToken');
require('dotenv').config();



exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const userExist = await pool.query(
            'SELECT id FROM users WHERE email = $1', [email]
        )
        if (userExist.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING *',
            [username, email, hashPassword]
        )

        return res.status(201).json({
            message: "Register success"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const userExist = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (userExist.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const user = userExist.rows[0];


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        //jwt
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const tokenHash = hashToken(refreshToken);
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) 
            VALUES ($1,$2, NOW() + INTERVAL '7 days')`, [user.id, tokenHash]
        )

        return res.status(200).json({
            message: "Login successfully",
            role: user.role,
            accessToken,
            refreshToken,
            username: user.username
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })

    }
}


exports.rePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const id = req.params.id;
        if (!id || !newPassword) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const findId = await pool.query(
            "SELECT id FROM users WHERE id = $1", [id]
        )
        if (findId.rows.length === 0) {
            return res.status(400).json({
                message: "Not user found"
            })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashPassword, id]
        )
        return res.status(200).json({
            message: "Re-password successfull"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}


exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh Token are required"
            })
        }

        const tokenHash = hashToken(refreshToken)

        const tokenExist = await pool.query(
            'SELECT * FROM refresh_tokens WHERE token_hash = $1',
            [tokenHash]
        )

        if (tokenExist.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid token"
            })
        }

        //delete token from DB
        await pool.query(
            'DELETE FROM refresh_tokens WHERE token_hash = $1',
            [tokenHash]
        )

        return res.status(200).json({
            message: "Logout successfully"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}


exports.getUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied"
            })
        }

        const getAllUser = await pool.query(
            "SELECT id, username, email, role, created_at FROM users"
        )
        return res.status(200).json({
            message: "Get users successfully",
            users: getAllUser.rows
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}