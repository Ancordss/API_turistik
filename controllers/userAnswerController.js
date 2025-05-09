const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize
const UserAnswer = require('../models/userAnswer.model.js')(sequelize, require('sequelize'));

const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');


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
 * /api/userAnswers/{userId}:
 *   get:
 *     summary: Obtener todas las respuestas de un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario cuyas respuestas se desean obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de respuestas del usuario obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   answer_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   question_id:
 *                     type: integer
 *                   answer:
 *                     type: string
 *                   date:
 *                     type: string
 *                   user_name:
 *                     type: string
 *                   question_text:
 *                     type: string
 */
const getUserAnswers = async (req, res) => {
  const { userId } = req.params;

  try {
    const [userAnswers, metadata] = await sequelize.query(`
      SELECT
        ua."Answer_ID",
        ua."User_ID",
        ua."Question_ID",
        ua."Answer",
        ua."Date",
        u."Name" AS "UserName",
        q."Question_Text"
      FROM
        "ADMIN"."UserAnswers" ua
      JOIN
        "ADMIN"."Users" u ON u."User_ID" = ua."User_ID"
      JOIN
        "ADMIN"."Questions" q ON q."Question_ID" = ua."Question_ID"
      WHERE
        ua."User_ID" = :userId
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(userAnswers);
  } catch (error) {
    console.error('Error al obtener las respuestas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las respuestas del usuario' });
  }
};

/**
 * @swagger
 * /api/userAnswers:
 *   post:
 *     summary: Crear una nueva respuesta de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               question_id:
 *                 type: integer
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Respuesta del usuario creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 question_id:
 *                   type: integer
 *                 answer:
 *                   type: string
 *                 date:
 *                   type: string
 */
const createUserAnswer = async (req, res) => {
  // Permitir ambos formatos de nombres de campos
  const User_ID = req.body.User_ID || req.body.user_id;
  const Question_ID = req.body.Question_ID || req.body.question_id;
  const Answer = req.body.Answer || req.body.answer;

  // Validación básica
  if (!User_ID || !Question_ID || !Answer) {
    return res.status(400).json({ message: 'Faltan datos requeridos: user_id, question_id o answer.' });
  }

  try {
    const newUserAnswer = await UserAnswer.create({
      User_ID,
      Question_ID,
      Answer
    });

    res.status(201).json(newUserAnswer);
  } catch (error) {
    console.error('Error al crear la respuesta del usuario:', error);
    res.status(500).json({ message: 'Error al crear la respuesta del usuario' });
  }
};

/**
 * @swagger
 * /api/userAnswers/{Answer_ID}:
 *   put:
 *     summary: Actualizar una respuesta de usuario
 *     parameters:
 *       - in: path
 *         name: Answer_ID
 *         required: true
 *         description: ID de la respuesta a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta de usuario actualizada correctamente
 *       404:
 *         description: Respuesta no encontrada
 */
const updateUserAnswer = async (req, res) => {
  const { Answer_ID } = req.params;
  const { Answer } = req.body;

  try {
    const userAnswer = await sequelize.query(`
      SELECT * FROM "ADMIN"."UserAnswers"
      WHERE "Answer_ID" = :Answer_ID
    `, {
      replacements: { Answer_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!userAnswer || userAnswer.length === 0) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }

    await sequelize.query(`
      UPDATE "ADMIN"."UserAnswers"
      SET "Answer" = :Answer, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Answer_ID" = :Answer_ID
    `, {
      replacements: { Answer, Answer_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Respuesta actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la respuesta del usuario:', error);
    res.status(500).json({ message: 'Error al actualizar la respuesta del usuario' });
  }
};

/**
 * @swagger
 * /api/userAnswers/{Answer_ID}:
 *   delete:
 *     summary: Eliminar una respuesta de usuario
 *     parameters:
 *       - in: path
 *         name: Answer_ID
 *         required: true
 *         description: ID de la respuesta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta de usuario eliminada con éxito
 *       404:
 *         description: Respuesta no encontrada
 */
const deleteUserAnswer = async (req, res) => {
  const { Answer_ID } = req.params;

  try {
    const userAnswer = await sequelize.query(`
      SELECT * FROM "ADMIN"."UserAnswers"
      WHERE "Answer_ID" = :Answer_ID
    `, {
      replacements: { Answer_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!userAnswer || userAnswer.length === 0) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }

    await sequelize.query(`
      DELETE FROM "ADMIN"."UserAnswers"
      WHERE "Answer_ID" = :Answer_ID
    `, {
      replacements: { Answer_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Respuesta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la respuesta del usuario:', error);
    res.status(500).json({ message: 'Error al eliminar la respuesta del usuario' });
  }
};

/**
 * @swagger
 * /api/userAnswers/multiple/{User_ID}:
 *   post:
 *     summary: Verificar si el usuario ha respondido varias preguntas
 *     parameters:
 *       - in: path
 *         name: User_ID
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: ID de las preguntas que se deben comprobar
 *     responses:
 *       200:
 *         description: Respuestas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answers:
 *                   type: object
 *                   description: Respuestas de las preguntas
 *                   additionalProperties:
 *                     type: boolean
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
 const checkMultipleUserAnswers = async (req, res) => {
  const { User_ID } = req.params;
  const { question_ids } = req.body;  // Recibe un array de IDs de preguntas

  try {
    // Verificar si el usuario existe
    console.log(User_ID);
    console.log(question_ids);
    console.log(req.body);
    const user = await sequelize.models.User.findByPk(User_ID);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log(user);
    
    // Consultar las respuestas del usuario para todas las preguntas proporcionadas
    const answers = await sequelize.models.UserAnswer.findAll({
      where: {
        User_ID,
        Question_ID: {
          [Sequelize.Op.in]: question_ids,  // Filtrar por un conjunto de preguntas
        },
      },
    });

    // Crear un objeto de respuestas para cada pregunta
    const answersMap = {};
    question_ids.forEach((question_id) => {
      const answered = answers.some((answer) => answer.Question_ID === question_id);
      answersMap[question_id] = answered;
    });

    res.json({ answers: answersMap });
  } catch (error) {
    console.error('Error al verificar las respuestas del usuario:', error);
    res.status(500).json({ message: 'Error al verificar las respuestas' });
  }
};


module.exports = { getUserAnswers, createUserAnswer, updateUserAnswer, deleteUserAnswer, checkMultipleUserAnswers };
