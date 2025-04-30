const { Question } = require('../config/config');  // Asegúrate de importar correctamente el modelo
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
 * /api/questions:
 *   get:
 *     summary: Obtener todas las preguntas
 *     responses:
 *       200:
 *         description: Lista de preguntas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Question_ID:
 *                     type: integer
 *                   Question_Text:
 *                     type: string
 *                   AI_Logic:
 *                     type: string
 *                   Answer_Type:
 *                     type: string
 *                   Is_Active:
 *                     type: boolean
 *                   Date_Created:
 *                     type: string
 */
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      attributes: ['Question_ID', 'Question_Text', 'AI_Logic', 'Answer_Type', 'Is_Active', 'Date_Created'],
    });

    res.json(questions);
  } catch (error) {
    console.error('Error al obtener las preguntas:', error);
    res.status(500).json({ message: 'Error al obtener las preguntas' });
  }
};

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Crear una nueva pregunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Question_Text:
 *                 type: string
 *               AI_Logic:
 *                 type: string
 *               Answer_Type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pregunta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Question_ID:
 *                   type: integer
 *                 Question_Text:
 *                   type: string
 *                 AI_Logic:
 *                   type: string
 *                 Answer_Type:
 *                   type: string
 *                 Is_Active:
 *                   type: boolean
 *                 Date_Created:
 *                   type: string
 */
const createQuestion = async (req, res) => {
  const { Question_Text, AI_Logic, Answer_Type } = req.body;

  try {
    const newQuestion = await Question.create({
      Question_Text,
      AI_Logic,
      Answer_Type,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error al crear la pregunta:', error);
    res.status(500).json({ message: 'Error al crear la pregunta' });
  }
};

/**
 * @swagger
 * /api/questions/{Question_ID}:
 *   put:
 *     summary: Actualizar una pregunta existente
 *     parameters:
 *       - in: path
 *         name: Question_ID
 *         required: true
 *         description: ID de la pregunta a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Question_Text:
 *                 type: string
 *               AI_Logic:
 *                 type: string
 *               Answer_Type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pregunta actualizada correctamente
 *       404:
 *         description: Pregunta no encontrada
 */
const updateQuestion = async (req, res) => {
  const { Question_ID } = req.params;
  const { Question_Text, AI_Logic, Answer_Type } = req.body;

  try {
    const question = await Question.findByPk(Question_ID);

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    question.Question_Text = Question_Text;
    question.AI_Logic = AI_Logic;
    question.Answer_Type = Answer_Type;

    await question.save();

    res.json(question);
  } catch (error) {
    console.error('Error al actualizar la pregunta:', error);
    res.status(500).json({ message: 'Error al actualizar la pregunta' });
  }
};

/**
 * @swagger
 * /api/questions/{Question_ID}:
 *   delete:
 *     summary: Eliminar una pregunta
 *     parameters:
 *       - in: path
 *         name: Question_ID
 *         required: true
 *         description: ID de la pregunta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pregunta eliminada con éxito
 *       404:
 *         description: Pregunta no encontrada
 */
const deleteQuestion = async (req, res) => {
  const { Question_ID } = req.params;

  try {
    const question = await Question.findByPk(Question_ID);

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    await question.destroy();

    res.json({ message: 'Pregunta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la pregunta:', error);
    res.status(500).json({ message: 'Error al eliminar la pregunta' });
  }
};

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion };
