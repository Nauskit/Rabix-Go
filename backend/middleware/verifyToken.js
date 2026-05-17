const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (req, res, next) => {

    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({
            message: "Access token is required"
        })
    }

    const token = authHeader.replace("Bearer", "").trim();

    if (!token) {
        return res.status(401).json({
            message: "Access token is required"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET)
        req.user = decoded
        next();

    } catch (err) {
        if (err.name === 'TokenExpireError') {
            return res.status(401).json({ message: "Token expired" })
        }
        return res.status(500).json({ message: "Invalid Token" })
    }
}

module.exports = verifyToken;