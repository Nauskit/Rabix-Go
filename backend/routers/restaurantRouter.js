const restaurantController = require('../controllers/restaurantController')
const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/verifyToken')

router.post('/create-Restaurant', verifyToken, restaurantController.createRestaurant);
router.get('/', restaurantController.getRestaurants)
router.get('/filter', restaurantController.filterRestaurants)



module.exports = router;