const express = require('express');
const { 
  getQuestionDetails, 
  createQuestionDetail, 
  updateQuestionDetail, 
  deleteQuestionDetail 
} = require('../controllers/questionDetailController');  // Asegúrate de importar correctamente el controlador

const router = express.Router();

// Ruta para obtener todos los detalles de las preguntas
router.get('/', getQuestionDetails);

// Ruta para crear un nuevo detalle de pregunta
router.post('/', createQuestionDetail);

// Ruta para actualizar un detalle de pregunta por ID
router.put('/:Detail_ID', updateQuestionDetail);

// Ruta para eliminar un detalle de pregunta por ID
router.delete('/:Detail_ID', deleteQuestionDetail);

module.exports = router;
