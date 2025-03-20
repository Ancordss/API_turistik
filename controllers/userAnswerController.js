const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize

// Función para obtener todas las respuestas de un usuario
const getUserAnswers = async (req, res) => {
  const { userId } = req.params;  // Obtener el ID del usuario desde los parámetros de la URL

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

    res.json(userAnswers);  // Devuelve los resultados obtenidos en formato JSON
  } catch (error) {
    console.error('Error al obtener las respuestas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las respuestas del usuario' });
  }
};

// Función para crear una nueva respuesta de usuario
const createUserAnswer = async (req, res) => {
  const { User_ID, Question_ID, Answer } = req.body;

  try {
    const newUserAnswer = await sequelize.query(`
      INSERT INTO "ADMIN"."UserAnswers" 
        ("User_ID", "Question_ID", "Answer", "Date", "createdAt", "updatedAt")
      VALUES 
        (:User_ID, :Question_ID, :Answer, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "Answer_ID", "User_ID", "Question_ID", "Answer", "Date"
    `, {
      replacements: { User_ID, Question_ID, Answer },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newUserAnswer[0]);  // Devolver la respuesta creada
  } catch (error) {
    console.error('Error al crear la respuesta del usuario:', error);
    res.status(500).json({ message: 'Error al crear la respuesta del usuario' });
  }
};

// Función para actualizar una respuesta de usuario
const updateUserAnswer = async (req, res) => {
  const { Answer_ID } = req.params;  // Obtener el ID de la respuesta desde los parámetros de la URL
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

    // Actualizar la respuesta
    await sequelize.query(`
      UPDATE "ADMIN"."UserAnswers"
      SET "Answer" = :Answer, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Answer_ID" = :Answer_ID
    `, {
      replacements: { Answer, Answer_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Respuesta actualizada correctamente' });  // Confirmación de actualización
  } catch (error) {
    console.error('Error al actualizar la respuesta del usuario:', error);
    res.status(500).json({ message: 'Error al actualizar la respuesta del usuario' });
  }
};

// Función para eliminar una respuesta de usuario
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

    // Eliminar la respuesta
    await sequelize.query(`
      DELETE FROM "ADMIN"."UserAnswers"
      WHERE "Answer_ID" = :Answer_ID
    `, {
      replacements: { Answer_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Respuesta eliminada con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar la respuesta del usuario:', error);
    res.status(500).json({ message: 'Error al eliminar la respuesta del usuario' });
  }
};

module.exports = { getUserAnswers, createUserAnswer, updateUserAnswer, deleteUserAnswer };
