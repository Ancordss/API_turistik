const express = require('express');
const { getRatingsComments, createRatingComment, updateRatingComment, deleteRatingComment } = require('../controllers/ratingsCommentController');

const router = express.Router();

// Ruta para obtener todas las calificaciones y comentarios
router.get('/', getRatingsComments);

// Ruta para crear una nueva calificación y comentario
router.post('/', createRatingComment);

// Ruta para actualizar una calificación y comentario por ID
router.put('/:Rating_ID', updateRatingComment);

// Ruta para eliminar una calificación y comentario por ID
router.delete('/:Rating_ID', deleteRatingComment);

module.exports = router;
