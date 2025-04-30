const { RatingsComment, sequelize } = require('../config/config');  // Asegúrate de importar correctamente el modelo
const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, 'mi_clave_secreta');
    req.User_ID = decoded.User_ID;
    req.User_Type = decoded.User_Type;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

/**
 * @swagger
 * /api/ratingsComments:
 *   get:
 *     summary: Obtener todas las calificaciones y comentarios de los lugares
 *     responses:
 *       200:
 *         description: Lista de calificaciones y comentarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Rating_ID:
 *                     type: integer
 *                   User_ID:
 *                     type: integer
 *                   Place_ID:
 *                     type: integer
 *                   Rating:
 *                     type: integer
 *                   Comment:
 *                     type: string
 *                   Date:
 *                     type: string
 *                   User_Name:
 *                     type: string
 *                   Place_Name:
 *                     type: string
 */
const getRatingsComments = async (req, res) => {
  try {
    const ratingsComments = await RatingsComment.findAll({
      attributes: ['Rating_ID', 'User_ID', 'Place_ID', 'Rating', 'Comment', 'Date'],
      include: [
        {
          model: sequelize.models.User,
          attributes: ['Name'],
        },
        {
          model: sequelize.models.TouristPlace,
          attributes: ['Name'],
        },
      ],
    });

    res.json(ratingsComments);
  } catch (error) {
    console.error('Error al obtener las calificaciones y comentarios:', error);
    res.status(500).json({ message: 'Error al obtener las calificaciones y comentarios' });
  }
};

/**
 * @swagger
 * /api/ratingsComments:
 *   post:
 *     summary: Crear una nueva calificación y comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               User_ID:
 *                 type: integer
 *               Place_ID:
 *                 type: integer
 *               Rating:
 *                 type: integer
 *               Comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Calificación y comentario creados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Rating_ID:
 *                   type: integer
 *                 User_ID:
 *                   type: integer
 *                 Place_ID:
 *                   type: integer
 *                 Rating:
 *                   type: integer
 *                 Comment:
 *                   type: string
 *                 Date:
 *                   type: string
 */
const createRatingComment = async (req, res) => {
  const { User_ID, Place_ID, Rating, Comment } = req.body;

  try {
    const newRatingComment = await RatingsComment.create({
      User_ID,
      Place_ID,
      Rating,
      Comment,
    });

    res.status(201).json(newRatingComment);
  } catch (error) {
    console.error('Error al crear la calificación y comentario:', error);
    res.status(500).json({ message: 'Error al crear la calificación y comentario' });
  }
};

/**
 * @swagger
 * /api/ratingsComments/{Rating_ID}:
 *   put:
 *     summary: Actualizar una calificación y comentario
 *     parameters:
 *       - in: path
 *         name: Rating_ID
 *         required: true
 *         description: ID de la calificación y comentario a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Rating:
 *                 type: integer
 *               Comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Calificación y comentario actualizados correctamente
 *       404:
 *         description: Calificación y comentario no encontrado
 */
const updateRatingComment = async (req, res) => {
  const { Rating_ID } = req.params;
  const { Rating, Comment } = req.body;

  try {
    const ratingComment = await RatingsComment.findByPk(Rating_ID);

    if (!ratingComment) {
      return res.status(404).json({ message: 'Calificación y comentario no encontrado' });
    }

    ratingComment.Rating = Rating;
    ratingComment.Comment = Comment;

    await ratingComment.save();

    res.json({ message: 'Calificación y comentario actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar la calificación y comentario:', error);
    res.status(500).json({ message: 'Error al actualizar la calificación y comentario' });
  }
};

/**
 * @swagger
 * /api/ratingsComments/{Rating_ID}:
 *   delete:
 *     summary: Eliminar una calificación y comentario
 *     parameters:
 *       - in: path
 *         name: Rating_ID
 *         required: true
 *         description: ID de la calificación y comentario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Calificación y comentario eliminados con éxito
 *       404:
 *         description: Calificación y comentario no encontrado
 */
const deleteRatingComment = async (req, res) => {
  const { Rating_ID } = req.params;

  try {
    const ratingComment = await RatingsComment.findByPk(Rating_ID);

    if (!ratingComment) {
      return res.status(404).json({ message: 'Calificación y comentario no encontrado' });
    }

    await ratingComment.destroy();

    res.json({ message: 'Calificación y comentario eliminados con éxito' });
  } catch (error) {
    console.error('Error al eliminar la calificación y comentario:', error);
    res.status(500).json({ message: 'Error al eliminar la calificación y comentario' });
  }
};

module.exports = { getRatingsComments, createRatingComment, updateRatingComment, deleteRatingComment };
