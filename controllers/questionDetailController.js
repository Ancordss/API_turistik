const { QuestionDetail } = require('../config/config');  // Asegúrate de importar correctamente el modelo
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
 * /api/questionDetails:
 *   get:
 *     summary: Obtener todos los detalles de las preguntas
 *     responses:
 *       200:
 *         description: Lista de detalles de preguntas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Detail_ID:
 *                     type: integer
 *                   Question_ID:
 *                     type: integer
 *                   Option_Text:
 *                     type: string
 *                   Route_Recommendation_ID:
 *                     type: integer
 *                   Response_Logic:
 *                     type: string
 *                   Is_Active:
 *                     type: boolean
 *                   Date_Created:
 *                     type: string
 */
const getQuestionDetails = async (req, res) => {
  try {
    const details = await QuestionDetail.findAll({
      attributes: ['Detail_ID', 'Question_ID', 'Option_Text', 'Route_Recommendation_ID', 'Response_Logic', 'Is_Active', 'Date_Created'],
    });

    res.json(details);
  } catch (error) {
    console.error('Error al obtener los detalles de las preguntas:', error);
    res.status(500).json({ message: 'Error al obtener los detalles de las preguntas' });
  }
};

/**
 * @swagger
 * /api/questionDetails:
 *   post:
 *     summary: Crear un nuevo detalle de pregunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Question_ID:
 *                 type: integer
 *               Option_Text:
 *                 type: string
 *               Route_Recommendation_ID:
 *                 type: integer
 *               Response_Logic:
 *                 type: string
 *             required:
 *               - Question_ID
 *               - Option_Text
 *     responses:
 *       201:
 *         description: Detalle de pregunta creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Detail_ID:
 *                   type: integer
 *                 Question_ID:
 *                   type: integer
 *                 Option_Text:
 *                   type: string
 *                 Route_Recommendation_ID:
 *                   type: integer
 *                 Response_Logic:
 *                   type: string
 *                 Is_Active:
 *                   type: boolean
 *                 Date_Created:
 *                   type: string
 */
const createQuestionDetail = async (req, res) => {
  const { Question_ID, Option_Text, Route_Recommendation_ID, Response_Logic } = req.body;

  try {
    const newDetail = await QuestionDetail.create({
      Question_ID,
      Option_Text,
      Route_Recommendation_ID,
      Response_Logic,
    });

    res.status(201).json(newDetail);
  } catch (error) {
    console.error('Error al crear el detalle de la pregunta:', error);
    res.status(500).json({ message: 'Error al crear el detalle de la pregunta' });
  }
};

/**
 * @swagger
 * /api/questionDetails/{Detail_ID}:
 *   put:
 *     summary: Actualizar un detalle de pregunta existente
 *     parameters:
 *       - in: path
 *         name: Detail_ID
 *         required: true
 *         description: ID del detalle de la pregunta a actualizar
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
 *               Option_Text:
 *                 type: string
 *               Route_Recommendation_ID:
 *                 type: integer
 *               Response_Logic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Detalle de pregunta actualizado correctamente
 *       404:
 *         description: Detalle de pregunta no encontrado
 */
const updateQuestionDetail = async (req, res) => {
  const { Detail_ID } = req.params;
  const { Question_ID, Option_Text, Route_Recommendation_ID, Response_Logic } = req.body;

  try {
    const detail = await QuestionDetail.findByPk(Detail_ID);

    if (!detail) {
      return res.status(404).json({ message: 'Detalle de pregunta no encontrado' });
    }

    detail.Question_ID = Question_ID;
    detail.Option_Text = Option_Text;
    detail.Route_Recommendation_ID = Route_Recommendation_ID;
    detail.Response_Logic = Response_Logic;

    await detail.save();

    res.json(detail);
  } catch (error) {
    console.error('Error al actualizar el detalle de la pregunta:', error);
    res.status(500).json({ message: 'Error al actualizar el detalle de la pregunta' });
  }
};

/**
 * @swagger
 * /api/questionDetails/{Detail_ID}:
 *   delete:
 *     summary: Eliminar un detalle de pregunta
 *     parameters:
 *       - in: path
 *         name: Detail_ID
 *         required: true
 *         description: ID del detalle de la pregunta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de pregunta eliminado con éxito
 *       404:
 *         description: Detalle de pregunta no encontrado
 */
const deleteQuestionDetail = async (req, res) => {
  const { Detail_ID } = req.params;

  try {
    const detail = await QuestionDetail.findByPk(Detail_ID);

    if (!detail) {
      return res.status(404).json({ message: 'Detalle de pregunta no encontrado' });
    }

    await detail.destroy();

    res.json({ message: 'Detalle de pregunta eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el detalle de la pregunta:', error);
    res.status(500).json({ message: 'Error al eliminar el detalle de la pregunta' });
  }
};

module.exports = { getQuestionDetails, createQuestionDetail, updateQuestionDetail, deleteQuestionDetail };
