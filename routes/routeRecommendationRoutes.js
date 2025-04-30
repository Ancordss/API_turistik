const express = require('express');
const { 
  getRouteRecommendations, 
  createRouteRecommendation, 
  updateRouteRecommendation, 
  deleteRouteRecommendation 
} = require('../controllers/routeRecommendationController');  // Asegúrate de importar correctamente el controlador

const router = express.Router();

// Ruta para obtener todas las recomendaciones de rutas
router.get('/', getRouteRecommendations);

// Ruta para crear una nueva recomendación de ruta
router.post('/', createRouteRecommendation);

// Ruta para actualizar una recomendación de ruta por ID
router.put('/:Recommendation_ID', updateRouteRecommendation);

// Ruta para eliminar una recomendación de ruta por ID
router.delete('/:Recommendation_ID', deleteRouteRecommendation);

module.exports = router;
