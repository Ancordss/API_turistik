// routes/questionRoutes.js

const express = require('express');
const { getQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');  // Asegúrate de importar el controlador

const router = express.Router();

// Ruta para obtener todas las preguntas
router.get('/', getQuestions);

// Ruta para crear una nueva pregunta
router.post('/', createQuestion);

// Ruta para actualizar una pregunta por ID
router.put('/:Question_ID', updateQuestion);

// Ruta para eliminar una pregunta por ID
router.delete('/:Question_ID', deleteQuestion);

module.exports = router;
