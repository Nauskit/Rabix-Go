const placesController = require('../controllers/placesController')
const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/verifyToken')
const { cache } = require('../middleware/cache')

router.post('/create-Place', verifyToken, placesController.createPlace);
router.post('/:id/images', placesController.addPlaceImage)

router.get('/', cache(300), placesController.getPlaces)
router.get('/filter', cache(120), placesController.filterRestaurants)
router.get('/:id', cache(120), placesController.getPlaceById)

router.post('/create-place', verifyToken, placesController.createPlace)
router.delete('/delete-place/:id', verifyToken, placesController.deletePlace)



module.exports = router;