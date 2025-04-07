const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize
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
 *                   question_id:
 *                     type: integer
 *                   place_id:
 *                     type: integer
 *                   question_text:
 *                     type: string
 *                   answer_type:
 *                     type: string
 *                   place_name:
 *                     type: string
 */
const getQuestions = async (req, res) => {
  try {
    const [questions, metadata] = await sequelize.query(`
      SELECT
        q."Question_ID",
        q."Place_ID",
        q."Question_Text",
        q."Answer_Type",
        p."Name" AS "PlaceName"
      FROM
        "ADMIN"."Questions" q
      JOIN
        "ADMIN"."TouristPlaces" p ON p."Place_ID" = q."Place_ID"
    `);

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
 *               place_id:
 *                 type: integer
 *               question_text:
 *                 type: string
 *               answer_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pregunta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question_id:
 *                   type: integer
 *                 place_id:
 *                   type: integer
 *                 question_text:
 *                   type: string
 *                 answer_type:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 */
const createQuestion = async (req, res) => {
  const { Place_ID, Question_Text, Answer_Type } = req.body;

  try {
    const newQuestion = await sequelize.query(`
      INSERT INTO "ADMIN"."Questions" 
        ("Place_ID", "Question_Text", "Answer_Type", "createdAt", "updatedAt")
      VALUES 
        (:Place_ID, :Question_Text, :Answer_Type, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "Question_ID", "Place_ID", "Question_Text", "Answer_Type", "createdAt", "updatedAt"
    `, {
      replacements: { Place_ID, Question_Text, Answer_Type },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newQuestion[0]);
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
 *               place_id:
 *                 type: integer
 *               question_text:
 *                 type: string
 *               answer_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pregunta actualizada correctamente
 *       404:
 *         description: Pregunta no encontrada
 */
const updateQuestion = async (req, res) => {
  const { Question_ID } = req.params;
  const { Place_ID, Question_Text, Answer_Type } = req.body;

  try {
    const question = await sequelize.query(`
      SELECT * FROM "ADMIN"."Questions" 
      WHERE "Question_ID" = :Question_ID
    `, {
      replacements: { Question_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!question || question.length === 0) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    await sequelize.query(`
      UPDATE "ADMIN"."Questions"
      SET "Place_ID" = :Place_ID, "Question_Text" = :Question_Text, "Answer_Type" = :Answer_Type, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Question_ID" = :Question_ID
    `, {
      replacements: { Place_ID, Question_Text, Answer_Type, Question_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Pregunta actualizada correctamente' });
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
    const question = await sequelize.query(`
      SELECT * FROM "ADMIN"."Questions"
      WHERE "Question_ID" = :Question_ID
    `, {
      replacements: { Question_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!question || question.length === 0) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    await sequelize.query(`
      DELETE FROM "ADMIN"."Questions" 
      WHERE "Question_ID" = :Question_ID
    `, {
      replacements: { Question_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Pregunta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la pregunta:', error);
    res.status(500).json({ message: 'Error al eliminar la pregunta' });
  }
};

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion };
