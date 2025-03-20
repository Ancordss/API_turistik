// routes/touristPlaceRoutes.js

const express = require('express');
const { getTouristPlaces, createTouristPlace, updateTouristPlace, deleteTouristPlace } = require('../controllers/touristPlaceController');  // Asegúrate de importar el controlador

const router = express.Router();

// Ruta para obtener todos los lugares turísticos
router.get('/', getTouristPlaces);

// Ruta para crear un nuevo lugar turístico
router.post('/', createTouristPlace);

// Ruta para actualizar un lugar turístico por ID
router.put('/:Place_ID', updateTouristPlace);

// Ruta para eliminar un lugar turístico por ID
router.delete('/:Place_ID', deleteTouristPlace);

module.exports = router;
