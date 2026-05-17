const authController = require('../controllers/authController')
const express = require('express');
const router = express.Router();
const { authLimit } = require('../middleware/rateLimit')
const verifyToken = require('../middleware/verifyToken')


router.get('/getUser', verifyToken, authController.getUser);

router.post('/register', authLimit, authController.register);
router.post('/login', authLimit, authController.login);
router.post('/logout', authController.logout);

router.patch('rePassword', authController.rePassword);

module.exports = router;