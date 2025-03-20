const express = require('express');
const { getRoutesHistory, createRouteHistory, updateRouteHistory, deleteRouteHistory } = require('../controllers/routesHistoryController');

const router = express.Router();

// Ruta para obtener todo el historial de rutas
router.get('/', getRoutesHistory);

// Ruta para crear una nueva entrada en el historial de rutas
router.post('/', createRouteHistory);

// Ruta para actualizar una entrada del historial de rutas por ID
router.put('/:History_ID', updateRouteHistory);

// Ruta para eliminar una entrada del historial de rutas por ID
router.delete('/:History_ID', deleteRouteHistory);

module.exports = router;
