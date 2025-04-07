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
 * /api/routes:
 *   get:
 *     summary: Obtener todas las rutas
 *     responses:
 *       200:
 *         description: Lista de rutas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   route_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   route_name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   registration_date:
 *                     type: string
 *                   duration:
 *                     type: string
 *                   distance:
 *                     type: string
 *                   coordinates:
 *                     type: string
 *                   user_name:
 *                     type: string
 */
const getRoutes = async (req, res) => {
  try {
    const [routes, metadata] = await sequelize.query(`
      SELECT
        r."Route_ID",
        r."User_ID",
        r."Route_Name",
        r."Description",
        r."Registration_Date",
        r."Duration",
        r."Distance",
        r."Coordinates",
        u."Name" AS "UserName"
      FROM
        "ADMIN"."Routes" r
      JOIN
        "ADMIN"."Users" u ON u."User_ID" = r."User_ID"
    `);

    res.json(routes);
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
    res.status(500).json({ message: 'Error al obtener las rutas' });
  }
};

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Crear una nueva ruta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               route_name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               distance:
 *                 type: string
 *               coordinates:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 route_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 route_name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 distance:
 *                   type: string
 *                 coordinates:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 */
const createRoute = async (req, res) => {
  const { User_ID, Route_Name, Description, Duration, Distance, Coordinates } = req.body;

  try {
    const newRoute = await sequelize.query(`
      INSERT INTO "ADMIN"."Routes" 
        ("User_ID", "Route_Name", "Description", "Duration", "Distance", "Coordinates", "createdAt", "updatedAt")
      VALUES 
        (:User_ID, :Route_Name, :Description, :Duration, :Distance, :Coordinates, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "Route_ID", "User_ID", "Route_Name", "Description", "Duration", "Distance", "Coordinates", "createdAt", "updatedAt"
    `, {
      replacements: { User_ID, Route_Name, Description, Duration, Distance, Coordinates },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newRoute[0]);
  } catch (error) {
    console.error('Error al crear la ruta:', error);
    res.status(500).json({ message: 'Error al crear la ruta' });
  }
};

/**
 * @swagger
 * /api/routes/{Route_ID}:
 *   put:
 *     summary: Actualizar una ruta existente
 *     parameters:
 *       - in: path
 *         name: Route_ID
 *         required: true
 *         description: ID de la ruta a actualizar
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
 *               route_name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               distance:
 *                 type: string
 *               coordinates:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ruta actualizada correctamente
 *       404:
 *         description: Ruta no encontrada
 */
const updateRoute = async (req, res) => {
  const { Route_ID } = req.params;
  const { User_ID, Route_Name, Description, Duration, Distance, Coordinates } = req.body;

  try {
    const route = await sequelize.query(`
      SELECT * FROM "ADMIN"."Routes" 
      WHERE "Route_ID" = :Route_ID
    `, {
      replacements: { Route_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!route || route.length === 0) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    await sequelize.query(`
      UPDATE "ADMIN"."Routes"
      SET "User_ID" = :User_ID, "Route_Name" = :Route_Name, "Description" = :Description, 
          "Duration" = :Duration, "Distance" = :Distance, "Coordinates" = :Coordinates, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Route_ID" = :Route_ID
    `, {
      replacements: { User_ID, Route_Name, Description, Duration, Distance, Coordinates, Route_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Ruta actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la ruta:', error);
    res.status(500).json({ message: 'Error al actualizar la ruta' });
  }
};

/**
 * @swagger
 * /api/routes/{Route_ID}:
 *   delete:
 *     summary: Eliminar una ruta
 *     parameters:
 *       - in: path
 *         name: Route_ID
 *         required: true
 *         description: ID de la ruta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ruta eliminada con éxito
 *       404:
 *         description: Ruta no encontrada
 */
const deleteRoute = async (req, res) => {
  const { Route_ID } = req.params;

  try {
    const route = await sequelize.query(`
      SELECT * FROM "ADMIN"."Routes"
      WHERE "Route_ID" = :Route_ID
    `, {
      replacements: { Route_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!route || route.length === 0) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    await sequelize.query(`
      DELETE FROM "ADMIN"."Routes" 
      WHERE "Route_ID" = :Route_ID
    `, {
      replacements: { Route_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Ruta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la ruta:', error);
    res.status(500).json({ message: 'Error al eliminar la ruta' });
  }
};

module.exports = { getRoutes, createRoute, updateRoute, deleteRoute };
