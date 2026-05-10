const rateLimit = require('express-rate-limit')


exports.authLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'Too many requests, please try again later',
})