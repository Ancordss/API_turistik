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
 *                   route_id:
 *                     type: integer
 *                   place_id:
 *                     type: integer
 *                   order_number:
 *                     type: integer
 *                   route_name:
 *                     type: string
 *                   place_name:
 *                     type: string
 */
const getPlacesInRoutes = async (req, res) => {
  try {
    const [placesInRoutes, metadata] = await sequelize.query(`
      SELECT
        pir."Route_ID",
        pir."Place_ID",
        pir."Order_Number",
        r."Route_Name",
        p."Name" AS "PlaceName"
      FROM
        "ADMIN"."PlacesInRoutes" pir
      JOIN
        "ADMIN"."Routes" r ON r."Route_ID" = pir."Route_ID"
      JOIN
        "ADMIN"."TouristPlaces" p ON p."Place_ID" = pir."Place_ID"
    `);

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
 *               route_id:
 *                 type: integer
 *               place_id:
 *                 type: integer
 *               order_number:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relación de lugar en ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 route_id:
 *                   type: integer
 *                 place_id:
 *                   type: integer
 *                 order_number:
 *                   type: integer
 */
const createPlaceInRoute = async (req, res) => {
  const { Route_ID, Place_ID, Order_Number } = req.body;

  try {
    const newPlaceInRoute = await sequelize.query(`
      INSERT INTO "ADMIN"."PlacesInRoute" 
        ("Route_ID", "Place_ID", "Order_Number", "createdAt", "updatedAt")
      VALUES 
        (:Route_ID, :Place_ID, :Order_Number, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "Route_ID", "Place_ID", "Order_Number"
    `, {
      replacements: { Route_ID, Place_ID, Order_Number },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newPlaceInRoute[0]);
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
 *               order_number:
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
    const placeInRoute = await sequelize.query(`
      SELECT * FROM "ADMIN"."PlacesInRoute"
      WHERE "Route_ID" = :Route_ID AND "Place_ID" = :Place_ID
    `, {
      replacements: { Route_ID, Place_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!placeInRoute || placeInRoute.length === 0) {
      return res.status(404).json({ message: 'Relación de lugar en ruta no encontrada' });
    }

    await sequelize.query(`
      UPDATE "ADMIN"."PlacesInRoute"
      SET "Order_Number" = :Order_Number, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Route_ID" = :Route_ID AND "Place_ID" = :Place_ID
    `, {
      replacements: { Order_Number, Route_ID, Place_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

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
    const placeInRoute = await sequelize.query(`
      SELECT * FROM "ADMIN"."PlacesInRoute"
      WHERE "Route_ID" = :Route_ID AND "Place_ID" = :Place_ID
    `, {
      replacements: { Route_ID, Place_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!placeInRoute || placeInRoute.length === 0) {
      return res.status(404).json({ message: 'Relación de lugar en ruta no encontrada' });
    }

    await sequelize.query(`
      DELETE FROM "ADMIN"."PlacesInRoute"
      WHERE "Route_ID" = :Route_ID AND "Place_ID" = :Place_ID
    `, {
      replacements: { Route_ID, Place_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Relación de lugar en ruta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la relación de lugar en ruta:', error);
    res.status(500).json({ message: 'Error al eliminar la relación de lugar en ruta' });
  }
};

module.exports = { getPlacesInRoutes, createPlaceInRoute, updatePlaceInRoute, deletePlaceInRoute };
