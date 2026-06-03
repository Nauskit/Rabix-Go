const placesController = require('../controllers/placesController')
const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/verifyToken')

router.post('/create-Place', verifyToken, placesController.createPlace);
router.post('/:id/images', placesController.addPlaceImage)

router.get('/', placesController.getPlaces)
router.get('/filter', placesController.filterRestaurants)
router.get('/:id', placesController.getPlaceById)
router.post('/create-place', placesController.createPlace)



module.exports = router;