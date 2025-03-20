// controllers/userPreferenceController.js

const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize

// Función para obtener todas las preferencias de usuario
const getUserPreferences = async (req, res) => {
  try {
    // Consulta SQL corregida con comillas dobles para respetar la capitalización en Oracle
    const [preferences, metadata] = await sequelize.query(`
      SELECT
        up."Preference_ID",
        up."User_ID",
        up."Category",
        up."Description",
        up."Registration_Date",
        u."Name" AS "UserName",
        u."Email" AS "UserEmail"
      FROM
        "ADMIN"."UserPreferences" up
      JOIN
        "ADMIN"."Users" u ON u."User_ID" = up."User_ID"
    `);

    res.json(preferences);  // Devuelve los resultados obtenidos en formato JSON
  } catch (error) {
    console.error('Error al obtener las preferencias de usuario:', error);
    res.status(500).json({ message: 'Error al obtener las preferencias' });
  }
};

// Función para crear una nueva preferencia de usuario
const createUserPreference = async (req, res) => {
  const { User_ID, Category, Description } = req.body;

  try {
    const newPreference = await sequelize.query(`
      INSERT INTO "ADMIN"."UserPreferences" 
        ("User_ID", "Category", "Description", "Registration_Date", "createdAt", "updatedAt")
      VALUES 
        (:User_ID, :Category, :Description, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "Preference_ID", "User_ID", "Category", "Description", "Registration_Date", "createdAt", "updatedAt"
    `, {
      replacements: { User_ID, Category, Description },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newPreference[0]);  // Devolver la preferencia creada
  } catch (error) {
    console.error('Error al crear la preferencia de usuario:', error);
    res.status(500).json({ message: 'Error al crear la preferencia' });
  }
};

// Función para actualizar una preferencia de usuario
const updateUserPreference = async (req, res) => {
  const { Preference_ID } = req.params;  // Obtener el ID de la preferencia desde los parámetros de la URL
  const { User_ID, Category, Description } = req.body;

  try {
    const preference = await sequelize.query(`
      SELECT * FROM "ADMIN"."UserPreferences" 
      WHERE "Preference_ID" = :Preference_ID
    `, {
      replacements: { Preference_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!preference || preference.length === 0) {
      return res.status(404).json({ message: 'Preferencia no encontrada' });
    }

    // Actualizar la preferencia
    await sequelize.query(`
      UPDATE "ADMIN"."UserPreferences"
      SET "User_ID" = :User_ID, "Category" = :Category, "Description" = :Description, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Preference_ID" = :Preference_ID
    `, {
      replacements: { User_ID, Category, Description, Preference_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Preferencia actualizada correctamente' });  // Confirmación de actualización
  } catch (error) {
    console.error('Error al actualizar la preferencia de usuario:', error);
    res.status(500).json({ message: 'Error al actualizar la preferencia' });
  }
};

// Función para eliminar una preferencia de usuario
const deleteUserPreference = async (req, res) => {
  const { Preference_ID } = req.params;

  try {
    const preference = await sequelize.query(`
      SELECT * FROM "ADMIN"."UserPreferences"
      WHERE "Preference_ID" = :Preference_ID
    `, {
      replacements: { Preference_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!preference || preference.length === 0) {
      return res.status(404).json({ message: 'Preferencia no encontrada' });
    }

    // Eliminar la preferencia
    await sequelize.query(`
      DELETE FROM "ADMIN"."UserPreferences" 
      WHERE "Preference_ID" = :Preference_ID
    `, {
      replacements: { Preference_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Preferencia eliminada con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar la preferencia de usuario:', error);
    res.status(500).json({ message: 'Error al eliminar la preferencia' });
  }
};

module.exports = { getUserPreferences, createUserPreference, updateUserPreference, deleteUserPreference };
