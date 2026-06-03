const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken')
const routeController = require('../controllers/routeController')


router.post('/', verifyToken, routeController.createRoute);
router.get('/showRoute', verifyToken, routeController.getUserRoute);
router.post('/:routeId/places', verifyToken, routeController.addPlcaeToRoute);
router.delete('/:routeId/places/:placeId', verifyToken, routeController.removePlaceFromRoute);

module.exports = router;