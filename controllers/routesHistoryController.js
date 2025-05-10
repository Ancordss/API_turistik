const { RoutesHistory, sequelize } = require('../config/config');  // Asegúrate de importar correctamente el modelo
const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, 'mi_clave_secreta');
    req.User_ID = decoded.User_ID;
    req.User_Type = decoded.User_Type;
    next();  // Pasa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

/**
 * @swagger
 * /api/routesHistory:
 *   get:
 *     summary: Obtener todo el historial de rutas
 *     responses:
 *       200:
 *         description: Lista del historial de rutas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   History_ID:
 *                     type: integer
 *                   User_ID:
 *                     type: integer
 *                   Route_ID:
 *                     type: integer
 *                   Route_Date:
 *                     type: string
 *                   User_Name:
 *                     type: string
 *                   Route_Name:
 *                     type: string
 */
const getRoutesHistory = async (req, res) => {
  try {
    const routesHistory = await RoutesHistory.findAll({
      attributes: ['History_ID', 'User_ID', 'Route_ID', 'Route_Date'],
      include: [
        {
          model: sequelize.models.User,
          attributes: ['Name'],
        },
        {
          model: sequelize.models.Route,
          attributes: ['Route_Name'],
        },
      ],
    });

    res.json(routesHistory);
  } catch (error) {
    console.error('Error al obtener el historial de rutas:', error);
    res.status(500).json({ message: 'Error al obtener el historial de rutas' });
  }
};

/**
 * @swagger
 * /api/routesHistory:
 *   post:
 *     summary: Crear una nueva entrada en el historial de rutas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               User_ID:
 *                 type: integer
 *               Route_ID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Entrada del historial de ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 History_ID:
 *                   type: integer
 *                 User_ID:
 *                   type: integer
 *                 Route_ID:
 *                   type: integer
 *                 Route_Date:
 *                   type: string
 */
const createRouteHistory = async (req, res) => {
  const { User_ID, Route_ID } = req.body;

  try {
    const newRouteHistory = await RoutesHistory.create({
      User_ID,
      Route_ID,
    });

    res.status(201).json(newRouteHistory);
  } catch (error) {
    console.error('Error al crear la entrada de historial de ruta:', error);
    res.status(500).json({ message: 'Error al crear la entrada de historial de ruta' });
  }
};

/**
 * @swagger
 * /api/routesHistory/{History_ID}:
 *   put:
 *     summary: Actualizar una entrada del historial de rutas
 *     parameters:
 *       - in: path
 *         name: History_ID
 *         required: true
 *         description: ID del historial de ruta a actualizar
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
 *               Route_ID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Entrada del historial de ruta actualizada correctamente
 *       404:
 *         description: Historial de ruta no encontrado
 */
const updateRouteHistory = async (req, res) => {
  const { History_ID } = req.params;
  const { User_ID, Route_ID } = req.body;

  try {
    const routeHistory = await RoutesHistory.findByPk(History_ID);

    if (!routeHistory) {
      return res.status(404).json({ message: 'Historial de ruta no encontrado' });
    }

    routeHistory.User_ID = User_ID;
    routeHistory.Route_ID = Route_ID;

    await routeHistory.save();

    res.json({ message: 'Historial de ruta actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el historial de ruta:', error);
    res.status(500).json({ message: 'Error al actualizar el historial de ruta' });
  }
};

/**
 * @swagger
 * /api/routesHistory/{History_ID}:
 *   delete:
 *     summary: Eliminar una entrada del historial de rutas
 *     parameters:
 *       - in: path
 *         name: History_ID
 *         required: true
 *         description: ID del historial de ruta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de ruta eliminado con éxito
 *       404:
 *         description: Historial de ruta no encontrado
 */
const deleteRouteHistory = async (req, res) => {
  const { History_ID } = req.params;

  try {
    const routeHistory = await RoutesHistory.findByPk(History_ID);

    if (!routeHistory) {
      return res.status(404).json({ message: 'Historial de ruta no encontrado' });
    }

    await routeHistory.destroy();

    res.json({ message: 'Historial de ruta eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el historial de ruta:', error);
    res.status(500).json({ message: 'Error al eliminar el historial de ruta' });
  }
};

module.exports = { getRoutesHistory, createRouteHistory, updateRouteHistory, deleteRouteHistory };
