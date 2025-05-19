const { Route, sequelize } = require('../config/config');  // Asegúrate de importar correctamente el modelo
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
 *                   Route_ID:
 *                     type: integer
 *                   User_ID:
 *                     type: integer
 *                   Route_Name:
 *                     type: string
 *                   Description:
 *                     type: string
 *                   Registration_Date:
 *                     type: string
 *                   Duration:
 *                     type: string
 *                   Distance:
 *                     type: string
 *                   Coordinates:
 *                     type: string
 *                   User_Name:
 *                     type: string
 */
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll({
      attributes: ['Route_ID', 'User_ID', 'Route_Name', 'Description', 'Registration_Date', 'Duration', 'Distance', 'Coordinates'],
      include: [{
        model: sequelize.models.User,
        attributes: ['Name'],
      }],
    });

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
 *               User_ID:
 *                 type: integer
 *               Route_Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               Duration:
 *                 type: string
 *               Distance:
 *                 type: string
 *               Coordinates:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ruta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Route_ID:
 *                   type: integer
 *                 User_ID:
 *                   type: integer
 *                 Route_Name:
 *                   type: string
 *                 Description:
 *                   type: string
 *                 Duration:
 *                   type: string
 *                 Distance:
 *                   type: string
 *                 Coordinates:
 *                   type: string
 *                 Created_At:
 *                   type: string
 *                 Updated_At:
 *                   type: string
 */
const createRoute = async (req, res) => {
  const { User_ID, Route_Name, Description, Duration, Distance, Coordinates } = req.body;

  if (!User_ID || !Route_Name) {
    return res.status(400).json({ message: 'User_ID y Route_Name son obligatorios' });
  }
   // get the time to insert
   const createdAt = new Date();
   const updatedAt = new Date();
   const Registration_Date = new Date();
  try {
    // 1. Ejecutar el INSERT manualmente
    const insertSql = `
      INSERT INTO ADMIN."Routes" ("User_ID", "Route_Name", "Description", "Duration", "Distance", "Coordinates", "createdAt", "updatedAt", "Registration_Date")
      VALUES (:User_ID, :Route_Name, :Description, :Duration, :Distance, :Coordinates, :createdAt, :updatedAt, :Registration_Date)
    `;

    await sequelize.query(insertSql, {
      replacements: { User_ID, Route_Name, Description, Duration, Distance, Coordinates, createdAt, updatedAt, Registration_Date },
    });

    // 2. Recuperar el último ID para este usuario (ordenado por fecha o secuencia si es posible)
    const result = await sequelize.query(
      `
      SELECT "Route_ID" FROM (
        SELECT "Route_ID" FROM ADMIN."Routes"
        WHERE "User_ID" = :User_ID
        ORDER BY "Routes"."createdAt" DESC
      ) WHERE ROWNUM = 1
      `,
      {
        replacements: { User_ID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log('result', result);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Ruta creada pero no se pudo recuperar el ID' });
    }

    res.json({ Route_ID: result[0].Route_ID });

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
 *               User_ID:
 *                 type: integer
 *               Route_Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               Duration:
 *                 type: string
 *               Distance:
 *                 type: string
 *               Coordinates:
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
    const route = await Route.findByPk(Route_ID);

    if (!route) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    route.User_ID = User_ID;
    route.Route_Name = Route_Name;
    route.Description = Description;
    route.Duration = Duration;
    route.Distance = Distance;
    route.Coordinates = Coordinates;

    await route.save();

    res.json(route);
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
    const route = await Route.findByPk(Route_ID);

    if (!route) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    await route.destroy();

    res.json({ message: 'Ruta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la ruta:', error);
    res.status(500).json({ message: 'Error al eliminar la ruta' });
  }
};

module.exports = { getRoutes, createRoute, updateRoute, deleteRoute };
