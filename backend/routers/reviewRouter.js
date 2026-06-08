const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController')
const verifyToken = require('../middleware/verifyToken')


router.get('/', reviewController.getTags);
router.post('/send-review/:placeId', verifyToken, reviewController.sendReview);

module.exports = router;
