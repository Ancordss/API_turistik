const { PlacesInRoute, sequelize } = require('../config/config');  // Asegúrate de importar correctamente el modelo

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

/**
 * @swagger
 * /api/placesInRoutes:
 *   get:
 *     summary: Obtener todos los lugares en las rutas
 *     responses:
 *       200:
 *         description: Lista de lugares en las rutas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Route_ID:
 *                     type: integer
 *                   Place_ID:
 *                     type: integer
 *                   Order_Number:
 *                     type: integer
 *                   Route_Name:
 *                     type: string
 *                   Place_Name:
 *                     type: string
 */
const getPlacesInRoutes = async (req, res) => {
  try {
    const placesInRoutes = await PlacesInRoute.findAll({
      attributes: ['Route_ID', 'Place_ID', 'Order_Number'],
      include: [
        {
          model: sequelize.models.Route,
          attributes: ['Route_Name'],
        },
        {
          model: sequelize.models.TouristPlace,
          attributes: ['Name'],
        }
      ]
    });

    res.json(placesInRoutes);
  } catch (error) {
    console.error('Error al obtener los lugares en las rutas:', error);
    res.status(500).json({ message: 'Error al obtener los lugares en las rutas' });
  }
};

/**
 * @swagger
 * /api/placesInRoutes:
 *   post:
 *     summary: Crear una nueva relación de lugar en ruta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Route_ID:
 *                 type: integer
 *               Place_ID:
 *                 type: integer
 *               Order_Number:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relación de lugar en ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Route_ID:
 *                   type: integer
 *                 Place_ID:
 *                   type: integer
 *                 Order_Number:
 *                   type: integer
 */
const createPlaceInRoute = async (req, res) => {
  const { Route_ID, Place_ID, Order_Number } = req.body;

  try {
    const newPlaceInRoute = await PlacesInRoute.create({
      Route_ID,
      Place_ID,
      Order_Number,
    });

    res.status(201).json(newPlaceInRoute);
  } catch (error) {
    console.error('Error al crear el lugar en ruta:', error);
    res.status(500).json({ message: 'Error al crear el lugar en ruta' });
  }
};

/**
 * @swagger
 * /api/placesInRoutes/{Route_ID}/{Place_ID}:
 *   put:
 *     summary: Actualizar una relación de lugar en ruta
 *     parameters:
 *       - in: path
 *         name: Route_ID
 *         required: true
 *         description: ID de la ruta a actualizar
 *         schema:
 *           type: integer
 *       - in: path
 *         name: Place_ID
 *         required: true
 *         description: ID del lugar a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Order_Number:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relación de lugar en ruta actualizada correctamente
 *       404:
 *         description: Relación de lugar en ruta no encontrada
 */
const updatePlaceInRoute = async (req, res) => {
  const { Route_ID, Place_ID } = req.params;
  const { Order_Number } = req.body;

  try {
    const placeInRoute = await PlacesInRoute.findOne({
      where: { Route_ID, Place_ID }
    });

    if (!placeInRoute) {
      return res.status(404).json({ message: 'Relación de lugar en ruta no encontrada' });
    }

    placeInRoute.Order_Number = Order_Number;

    await placeInRoute.save();

    res.json({ message: 'Relación de lugar en ruta actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la relación de lugar en ruta:', error);
    res.status(500).json({ message: 'Error al actualizar la relación de lugar en ruta' });
  }
};

/**
 * @swagger
 * /api/placesInRoutes/{Route_ID}/{Place_ID}:
 *   delete:
 *     summary: Eliminar una relación de lugar en ruta
 *     parameters:
 *       - in: path
 *         name: Route_ID
 *         required: true
 *         description: ID de la ruta a eliminar
 *         schema:
 *           type: integer
 *       - in: path
 *         name: Place_ID
 *         required: true
 *         description: ID del lugar a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relación de lugar en ruta eliminada con éxito
 *       404:
 *         description: Relación de lugar en ruta no encontrada
 */
const deletePlaceInRoute = async (req, res) => {
  const { Route_ID, Place_ID } = req.params;

  try {
    const placeInRoute = await PlacesInRoute.findOne({
      where: { Route_ID, Place_ID }
    });

    if (!placeInRoute) {
      return res.status(404).json({ message: 'Relación de lugar en ruta no encontrada' });
    }

    await placeInRoute.destroy();

    res.json({ message: 'Relación de lugar en ruta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la relación de lugar en ruta:', error);
    res.status(500).json({ message: 'Error al eliminar la relación de lugar en ruta' });
  }
};

module.exports = { getPlacesInRoutes, createPlaceInRoute, updatePlaceInRoute, deletePlaceInRoute };
