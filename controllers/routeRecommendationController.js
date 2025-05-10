const { RouteRecommendation } = require('../config/config');  // Asegúrate de importar correctamente el modelo
const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  // Obtener el token de los encabezados
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no encontrado' });
  }

  // Verificar el token
  try {
    const decoded = jwt.verify(token, 'mi_clave_secreta');
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();  // Pasa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { verifyToken };

/**
 * @swagger
 * /api/routeRecommendations:
 *   get:
 *     summary: Obtener todas las recomendaciones de rutas
 *     responses:
 *       200:
 *         description: Lista de recomendaciones de rutas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Recommendation_ID:
 *                     type: integer
 *                   Question_ID:
 *                     type: integer
 *                   User_ID:
 *                     type: integer
 *                   Route_ID:
 *                     type: integer
 *                   Answer:
 *                     type: string
 *                   Date:
 *                     type: string
 */
const getRouteRecommendations = async (req, res) => {
  try {
    const recommendations = await RouteRecommendation.findAll({
      attributes: ['Recommendation_ID', 'Question_ID', 'User_ID', 'Route_ID', 'Answer', 'Date'],
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Error al obtener las recomendaciones de rutas:', error);
    res.status(500).json({ message: 'Error al obtener las recomendaciones de rutas' });
  }
};

/**
 * @swagger
 * /api/routeRecommendations:
 *   post:
 *     summary: Crear una nueva recomendación de ruta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Question_ID:
 *                 type: integer
 *               User_ID:
 *                 type: integer
 *               Route_ID:
 *                 type: integer
 *               Answer:
 *                 type: string
 *             required:
 *               - Question_ID
 *               - User_ID
 *               - Route_ID
 *               - Answer
 *     responses:
 *       201:
 *         description: Recomendación de ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Recommendation_ID:
 *                   type: integer
 *                 Question_ID:
 *                   type: integer
 *                 User_ID:
 *                   type: integer
 *                 Route_ID:
 *                   type: integer
 *                 Answer:
 *                   type: string
 *                 Date:
 *                   type: string
 */
const createRouteRecommendation = async (req, res) => {
  const { Question_ID, User_ID, Route_ID, Answer } = req.body;

  try {
    const newRecommendation = await RouteRecommendation.create({
      Question_ID,
      User_ID,
      Route_ID,
      Answer,
    });

    res.status(201).json(newRecommendation);
  } catch (error) {
    console.error('Error al crear la recomendación de ruta:', error);
    res.status(500).json({ message: 'Error al crear la recomendación de ruta' });
  }
};

/**
 * @swagger
 * /api/routeRecommendations/{Recommendation_ID}:
 *   put:
 *     summary: Actualizar una recomendación de ruta existente
 *     parameters:
 *       - in: path
 *         name: Recommendation_ID
 *         required: true
 *         description: ID de la recomendación de ruta a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Question_ID:
 *                 type: integer
 *               User_ID:
 *                 type: integer
 *               Route_ID:
 *                 type: integer
 *               Answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recomendación de ruta actualizada correctamente
 *       404:
 *         description: Recomendación no encontrada
 */
const updateRouteRecommendation = async (req, res) => {
  const { Recommendation_ID } = req.params;
  const { Question_ID, User_ID, Route_ID, Answer } = req.body;

  try {
    const recommendation = await RouteRecommendation.findByPk(Recommendation_ID);

    if (!recommendation) {
      return res.status(404).json({ message: 'Recomendación de ruta no encontrada' });
    }

    recommendation.Question_ID = Question_ID;
    recommendation.User_ID = User_ID;
    recommendation.Route_ID = Route_ID;
    recommendation.Answer = Answer;

    await recommendation.save();

    res.json(recommendation);
  } catch (error) {
    console.error('Error al actualizar la recomendación de ruta:', error);
    res.status(500).json({ message: 'Error al actualizar la recomendación de ruta' });
  }
};

/**
 * @swagger
 * /api/routeRecommendations/{Recommendation_ID}:
 *   delete:
 *     summary: Eliminar una recomendación de ruta
 *     parameters:
 *       - in: path
 *         name: Recommendation_ID
 *         required: true
 *         description: ID de la recomendación de ruta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recomendación de ruta eliminada con éxito
 *       404:
 *         description: Recomendación no encontrada
 */
const deleteRouteRecommendation = async (req, res) => {
  const { Recommendation_ID } = req.params;

  try {
    const recommendation = await RouteRecommendation.findByPk(Recommendation_ID);

    if (!recommendation) {
      return res.status(404).json({ message: 'Recomendación de ruta no encontrada' });
    }

    await recommendation.destroy();

    res.json({ message: 'Recomendación de ruta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la recomendación de ruta:', error);
    res.status(500).json({ message: 'Error al eliminar la recomendación de ruta' });
  }
};

module.exports = { getRouteRecommendations, createRouteRecommendation, updateRouteRecommendation, deleteRouteRecommendation };
