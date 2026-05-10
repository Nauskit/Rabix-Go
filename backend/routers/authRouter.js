const authController = require('../controllers/authController')
const express = require('express');
const router = express.Router();
const { authLimit } = require('../middleware/rateLimit')


router.post('/register', authLimit, authController.register);
router.post('/login', authLimit, authController.login);


module.exports = router;