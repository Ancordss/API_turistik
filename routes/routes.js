const express = require('express');
const { getRoutes, createRoute, updateRoute, deleteRoute } = require('../controllers/routeController');  // Asegúrate de importar correctamente el controlador

const router = express.Router();

// Ruta para obtener todas las rutas
router.get('/', getRoutes);

// Ruta para crear una nueva ruta
router.post('/', createRoute);

// Ruta para actualizar una ruta por ID
router.put('/:Route_ID', updateRoute);

// Ruta para eliminar una ruta por ID
router.delete('/:Route_ID', deleteRoute);

module.exports = router;
