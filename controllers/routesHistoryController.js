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
 *                   history_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   route_id:
 *                     type: integer
 *                   route_date:
 *                     type: string
 *                   user_name:
 *                     type: string
 *                   route_name:
 *                     type: string
 */
const getRoutesHistory = async (req, res) => {
  try {
    const routesHistory = await sequelize.query(`
      SELECT
        rh."History_ID",
        rh."User_ID",
        rh."Route_ID",
        rh."Route_Date",
        u."Name" AS "UserName",
        r."Route_Name" AS "RouteName"
      FROM
        "ADMIN"."RoutesHistories" rh
      JOIN
        "ADMIN"."Users" u ON u."User_ID" = rh."User_ID"
      JOIN
        "ADMIN"."Routes" r ON r."Route_ID" = rh."Route_ID"
    `);

    res.json(routesHistory[0]);
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
 *               user_id:
 *                 type: integer
 *               route_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Entrada del historial de ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 route_id:
 *                   type: integer
 *                 route_date:
 *                   type: string
 */
const createRouteHistory = async (req, res) => {
  const { User_ID, Route_ID } = req.body;

  try {
    const newRouteHistory = await sequelize.query(`
      INSERT INTO "ADMIN"."RoutesHistories" 
        ("User_ID", "Route_ID", "Route_Date", "createdAt", "updatedAt")
      VALUES
        (:User_ID, :Route_ID, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "History_ID", "User_ID", "Route_ID", "Route_Date"
    `, {
      replacements: { User_ID, Route_ID },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newRouteHistory[0]);
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
 *               user_id:
 *                 type: integer
 *               route_id:
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
    const routeHistory = await sequelize.query(`
      SELECT * FROM "ADMIN"."RoutesHistories"
      WHERE "History_ID" = :History_ID
    `, {
      replacements: { History_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!routeHistory || routeHistory.length === 0) {
      return res.status(404).json({ message: 'Historial de ruta no encontrado' });
    }

    await sequelize.query(`
      UPDATE "ADMIN"."RoutesHistories"
      SET "User_ID" = :User_ID, "Route_ID" = :Route_ID, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "History_ID" = :History_ID
    `, {
      replacements: { User_ID, Route_ID, History_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

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
    const routeHistory = await sequelize.query(`
      SELECT * FROM "ADMIN"."RoutesHistories"
      WHERE "History_ID" = :History_ID
    `, {
      replacements: { History_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!routeHistory || routeHistory.length === 0) {
      return res.status(404).json({ message: 'Historial de ruta no encontrado' });
    }

    await sequelize.query(`
      DELETE FROM "ADMIN"."RoutesHistories"
      WHERE "History_ID" = :History_ID
    `, {
      replacements: { History_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Historial de ruta eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el historial de ruta:', error);
    res.status(500).json({ message: 'Error al eliminar el historial de ruta' });
  }
};

module.exports = { getRoutesHistory, createRouteHistory, updateRouteHistory, deleteRouteHistory };
