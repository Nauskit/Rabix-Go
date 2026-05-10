const bcrypt = require('bcrypt')
const { pool } = require("../config/db")
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
    const { email, password } = req.body
}