const restaurantController = require('../controllers/restaurantController')
const express = require('express')
const router = express.Router();


router.post('/create-Restaurant', restaurantController.createRestaurant);




module.exports = router;