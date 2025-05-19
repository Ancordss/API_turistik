const express = require('express');
const { getPlacesInRoutes, createPlaceInRoute, updatePlaceInRoute, deletePlaceInRoute, getPlacesInRoutesDetailed } = require('../controllers/placesInRouteController');  // Asegúrate de importar correctamente el controlador

const router = express.Router();

// Ruta para obtener todos los lugares en las rutas
router.get('/', getPlacesInRoutes);

// Ruta para crear una nueva relación de lugar en ruta
router.post('/', createPlaceInRoute);

// Ruta para actualizar una relación de lugar en ruta por ID
router.put('/:Route_ID/:Place_ID', updatePlaceInRoute);

// Ruta para eliminar una relación de lugar en ruta por ID
router.delete('/:Route_ID/:Place_ID', deletePlaceInRoute);

// Ruta para obtener lugares en rutas con detalles completos
router.get('/detailed/:userId', getPlacesInRoutesDetailed);

module.exports = router;
