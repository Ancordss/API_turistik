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
 * /api/userPreferences:
 *   get:
 *     summary: Obtener todas las preferencias de usuario
 *     responses:
 *       200:
 *         description: Lista de preferencias de usuario obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   preference_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   registration_date:
 *                     type: string
 *                   user_name:
 *                     type: string
 *                   user_email:
 *                     type: string
 */
const getUserPreferences = async (req, res) => {
  try {
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

    res.json(preferences);
  } catch (error) {
    console.error('Error al obtener las preferencias de usuario:', error);
    res.status(500).json({ message: 'Error al obtener las preferencias' });
  }
};

/**
 * @swagger
 * /api/userPreferences:
 *   post:
 *     summary: Crear una nueva preferencia de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Preferencia de usuario creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 preference_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 category:
 *                   type: string
 *                 description:
 *                   type: string
 *                 registration_date:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 */
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

    res.status(201).json(newPreference[0]);
  } catch (error) {
    console.error('Error al crear la preferencia de usuario:', error);
    res.status(500).json({ message: 'Error al crear la preferencia' });
  }
};

/**
 * @swagger
 * /api/userPreferences/{Preference_ID}:
 *   put:
 *     summary: Actualizar una preferencia de usuario
 *     parameters:
 *       - in: path
 *         name: Preference_ID
 *         required: true
 *         description: ID de la preferencia a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Preferencia de usuario actualizada correctamente
 *       404:
 *         description: Preferencia no encontrada
 */
const updateUserPreference = async (req, res) => {
  const { Preference_ID } = req.params;
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

    await sequelize.query(`
      UPDATE "ADMIN"."UserPreferences"
      SET "User_ID" = :User_ID, "Category" = :Category, "Description" = :Description, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Preference_ID" = :Preference_ID
    `, {
      replacements: { User_ID, Category, Description, Preference_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Preferencia actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la preferencia de usuario:', error);
    res.status(500).json({ message: 'Error al actualizar la preferencia' });
  }
};

/**
 * @swagger
 * /api/userPreferences/{Preference_ID}:
 *   delete:
 *     summary: Eliminar una preferencia de usuario
 *     parameters:
 *       - in: path
 *         name: Preference_ID
 *         required: true
 *         description: ID de la preferencia a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Preferencia de usuario eliminada correctamente
 *       404:
 *         description: Preferencia no encontrada
 */
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

    await sequelize.query(`
      DELETE FROM "ADMIN"."UserPreferences" 
      WHERE "Preference_ID" = :Preference_ID
    `, {
      replacements: { Preference_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Preferencia eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la preferencia de usuario:', error);
    res.status(500).json({ message: 'Error al eliminar la preferencia' });
  }
};

module.exports = { getUserPreferences, createUserPreference, updateUserPreference, deleteUserPreference };





