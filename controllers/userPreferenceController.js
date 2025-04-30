const { UserPreference, sequelize } = require('../config/config');  // Asegúrate de importar correctamente Sequelize y UserPreference
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
 *                   Preference_ID:
 *                     type: integer
 *                   User_ID:
 *                     type: integer
 *                   Category:
 *                     type: string
 *                   Description:
 *                     type: string
 *                   Registration_Date:
 *                     type: string
 */
const getUserPreferences = async (req, res) => {
  try {
    const preferences = await UserPreference.findAll({
      include: {
        model: sequelize.models.User, // Relaciona la tabla "User" para obtener nombre y correo
        attributes: ['Name', 'Email'],
      },
    });
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
 *               User_ID:
 *                 type: integer
 *               Category:
 *                 type: string
 *               Description:
 *                 type: string
 *             required:
 *               - User_ID
 *               - Category
 *               - Description
 *     responses:
 *       201:
 *         description: Preferencia de usuario creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Preference_ID:
 *                   type: integer
 *                 User_ID:
 *                   type: integer
 *                 Category:
 *                   type: string
 *                 Description:
 *                   type: string
 *                 Registration_Date:
 *                   type: string
 */
const createUserPreference = async (req, res) => {
  const { User_ID, Category, Description } = req.body;

  try {
    const newPreference = await UserPreference.create({
      User_ID,
      Category,
      Description,
      Registration_Date: new Date(),
    });

    res.status(201).json(newPreference);
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
 *               User_ID:
 *                 type: integer
 *               Category:
 *                 type: string
 *               Description:
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
    const preference = await UserPreference.findByPk(Preference_ID);

    if (!preference) {
      return res.status(404).json({ message: 'Preferencia no encontrada' });
    }

    preference.User_ID = User_ID;
    preference.Category = Category;
    preference.Description = Description;

    await preference.save();

    res.json(preference);
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
 *         description: Preferencia de usuario eliminada con éxito
 *       404:
 *         description: Preferencia no encontrada
 */
const deleteUserPreference = async (req, res) => {
  const { Preference_ID } = req.params;

  try {
    const preference = await UserPreference.findByPk(Preference_ID);

    if (!preference) {
      return res.status(404).json({ message: 'Preferencia no encontrada' });
    }

    await preference.destroy();

    res.json({ message: 'Preferencia eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la preferencia de usuario:', error);
    res.status(500).json({ message: 'Error al eliminar la preferencia' });
  }
};

module.exports = { getUserPreferences, createUserPreference, updateUserPreference, deleteUserPreference };
