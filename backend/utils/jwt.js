const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_SCRET_KEY = process.env.ACCESS_JWT_SECRET;
const REFRESH_SCRET_KEY = process.env.REFRESH_JWT_SECRET;


const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role
    },
        ACCESS_SCRET_KEY,
        { expiresIn: "15m" }
    )
}




const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role
    },
        REFRESH_SCRET_KEY,
        { expiresIn: "7d" }
    )
}

module.exports = { generateAccessToken, generateRefreshToken }