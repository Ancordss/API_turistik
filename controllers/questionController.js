// controllers/questionController.js

const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize

// Función para obtener todas las preguntas
const getQuestions = async (req, res) => {
  try {
    // Consulta SQL corregida con comillas dobles para respetar la capitalización en Oracle
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

    res.json(questions);  // Devuelve las preguntas obtenidas en formato JSON
  } catch (error) {
    console.error('Error al obtener las preguntas:', error);
    res.status(500).json({ message: 'Error al obtener las preguntas' });
  }
};

// Función para crear una nueva pregunta
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

    res.status(201).json(newQuestion[0]);  // Devolver la pregunta creada
  } catch (error) {
    console.error('Error al crear la pregunta:', error);
    res.status(500).json({ message: 'Error al crear la pregunta' });
  }
};

// Función para actualizar una pregunta
const updateQuestion = async (req, res) => {
  const { Question_ID } = req.params;  // Obtener el ID de la pregunta desde los parámetros de la URL
  const { Place_ID, Question_Text, Answer_Type } = req.body;

  try {
    // Buscar la pregunta por ID
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

    // Actualizar la pregunta
    await sequelize.query(`
      UPDATE "ADMIN"."Questions"
      SET "Place_ID" = :Place_ID, "Question_Text" = :Question_Text, "Answer_Type" = :Answer_Type, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Question_ID" = :Question_ID
    `, {
      replacements: { Place_ID, Question_Text, Answer_Type, Question_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Pregunta actualizada correctamente' });  // Confirmación de actualización
  } catch (error) {
    console.error('Error al actualizar la pregunta:', error);
    res.status(500).json({ message: 'Error al actualizar la pregunta' });
  }
};

// Función para eliminar una pregunta
const deleteQuestion = async (req, res) => {
  const { Question_ID } = req.params;

  try {
    // Buscar la pregunta por ID
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

    // Eliminar la pregunta
    await sequelize.query(`
      DELETE FROM "ADMIN"."Questions" 
      WHERE "Question_ID" = :Question_ID
    `, {
      replacements: { Question_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Pregunta eliminada con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar la pregunta:', error);
    res.status(500).json({ message: 'Error al eliminar la pregunta' });
  }
};

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion };
