const { PlacesInRoute, sequelize, TouristPlaces, Routes, Users } = require('../config/config');  // Importar modelos necesarios

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
 *                   TouristPlace_ID:
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
      attributes: ['PlacesInRoute_ID','Route_ID', 'TourisPlace_ID', 'Order_Number'],
      include: [
        {
          model: sequelize.models.Route,
          attributes: ['Route_Name'],
        },
        {
          model: sequelize.models.TouristPlace,
          attributes: ['Places'],
        },
        {
          model: sequelize.models.TouristPlace,
          attributes: ['Raw_data'],
        },
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
 *               TouristPlace_ID:
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
 *                 TouristPlace_ID:
 *                   type: integer
 *                 Order_Number:
 *                   type: integer
 */
const createPlaceInRoute = async (req, res) => {
  const { Route_ID, TouristPlace_ID, Order_Number } = req.body;

  try {
    const newPlaceInRoute = await PlacesInRoute.create({
      Route_ID,
      TouristPlace_ID,
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
 *         name: TouristPlace_ID
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
  const { Route_ID, 
    TouristPlace_ID } = req.params;
  const { Order_Number } = req.body;

  try {
    const placeInRoute = await PlacesInRoute.findOne({
      where: { Route_ID, TouristPlace_ID }
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
 *         name: TouristPlace_ID
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
  const { Route_ID, TouristPlace_ID } = req.params;

  try {
    const placeInRoute = await PlacesInRoute.findOne({
      where: { Route_ID, TouristPlace_ID }
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

/**
 * @swagger
 * /api/placesInRoutes/detailed/{userId}:
 *   get:
 *     summary: Obtener lugares en rutas con detalles completos
 *     tags:
 *       - PlacesInRoutes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario para filtrar las rutas
 *     responses:
 *       200:
 *         description: Lista de lugares en rutas con detalles completos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Route_ID:
 *                     type: integer
 *                   TouristPlace_ID:
 *                     type: integer
 *                   Order_Number:
 *                     type: integer
 *                   route:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                   place:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       400:
 *         description: Usuario ID no válido
 *       401:
 *         description: Token no válido o expirado
 *       403:
 *         description: Usuario no autorizado
 */
const getPlacesInRoutesDetailed = async (req, res) => {
  try {
    // Obtener el ID del usuario de los parámetros
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Usuario ID es requerido' });
    }

    // Convertir userId a número si es necesario
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: 'Usuario ID debe ser un número' });
    }

    // Consulta SQL directa con joins
    const query = `
      SELECT 
        pir."Route_ID" as "Route_ID",
        pir."TouristPlace_ID" as "TouristPlace_ID",
        pir."Order_Number" as "Order_Number",
        r."Route_ID" as "ROUTE_ID",
        r."Route_Name" as "ROUTE_NAME",
        r."Description" as "ROUTE_DESCRIPTION",
        r."Duration" as "ROUTE_DURATION",
        r."Distance" as "ROUTE_DISTANCE",
        r."Coordinates" as "ROUTE_COORDINATES",
        r."Registration_Date" as "ROUTE_REGISTRATION_DATE",
        u."User_ID" as "USER_ID",
        u."Name" as "USER_NAME",
        tp."TouristPlace_ID" as "PLACE_ID",
        tp."Places" as "PLACE_NAME",
        tp."Raw_data" as "PLACE_RAW_DATA"
      FROM ADMIN."PlacesInRoutes" pir
      JOIN ADMIN."Routes" r ON pir."Route_ID" = r."Route_ID"
      JOIN ADMIN."Users" u ON r."User_ID" = u."User_ID"
      JOIN ADMIN."TouristPlaces" tp ON pir."TouristPlace_ID" = tp."TouristPlace_ID"
      WHERE u."User_ID" = ?
      ORDER BY pir."Order_Number" ASC
    `;

    // Ejecutar la consulta
    const [results] = await sequelize.query(query, {
      replacements: [userIdNum],
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });
    
    console.log('Tipo de results:', typeof results);
    console.log('Contenido de results:', results);

    // Si obtenemos un solo registro, lo convertimos en array
    const resultsArray = Array.isArray(results) ? results : [results];

    // Transformar los resultados para que coincidan con la estructura esperada
    const formattedResults = resultsArray.map(row => {
      // Convertir el Buffer de raw_data a JSON
      const rawData = row["PLACE_RAW_DATA"];
      let placeData = {};
      try {
        if (Buffer.isBuffer(rawData)) {
          placeData = JSON.parse(rawData.toString());
        } else {
          placeData = rawData;
        }
      } catch (err) {
        console.error('Error al parsear raw_data:', err);
        placeData = { error: 'No se pudo parsear los datos' };
      }

      return {
        Route_ID: row["Route_ID"],
        TouristPlace_ID: row["TouristPlace_ID"],
        Order_Number: row["Order_Number"],
        route: {
          id: row["ROUTE_ID"],
          name: row["ROUTE_NAME"],
          description: row["ROUTE_DESCRIPTION"],
          duration: row["ROUTE_DURATION"],
          distance: row["ROUTE_DISTANCE"],
          coordinates: row["ROUTE_COORDINATES"],
          registration_date: row["ROUTE_REGISTRATION_DATE"],
          user: {
            id: row["USER_ID"],
            name: row["USER_NAME"]
          }
        },
        place: {
          id: row["PLACE_ID"],
          name: row["PLACE_NAME"],
          data: placeData
        }
      };
    });

    // Asegurarse de que siempre devolvemos un array
    if (!Array.isArray(formattedResults)) {
      formattedResults = [formattedResults];
    }

    console.log('Número de resultados:', formattedResults.length);
    console.log('Primer resultado:', formattedResults[0]);

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error al obtener lugares en rutas con detalles:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getPlacesInRoutes, createPlaceInRoute, updatePlaceInRoute, deletePlaceInRoute, getPlacesInRoutesDetailed };
