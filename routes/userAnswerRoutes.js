const express = require('express');
const { getUserAnswers, createUserAnswer, updateUserAnswer, deleteUserAnswer } = require('../controllers/userAnswerController');  // Asegúrate de importar el controlador

const router = express.Router();

// Ruta para obtener todas las respuestas de un usuario
router.get('/:userId', getUserAnswers);

// Ruta para crear una nueva respuesta de usuario
router.post('/', createUserAnswer);

// Ruta para actualizar una respuesta de usuario por ID
router.put('/:Answer_ID', updateUserAnswer);

// Ruta para eliminar una respuesta de usuario por ID
router.delete('/:Answer_ID', deleteUserAnswer);

module.exports = router;
