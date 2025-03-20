const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize

// Función para obtener todos los lugares en las rutas
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

    res.json(placesInRoutes);  // Devuelve los resultados obtenidos en formato JSON
  } catch (error) {
    console.error('Error al obtener los lugares en las rutas:', error);
    res.status(500).json({ message: 'Error al obtener los lugares en las rutas' });
  }
};

// Función para crear una nueva relación de lugar en ruta
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

    res.status(201).json(newPlaceInRoute[0]);  // Devolver el lugar en ruta creado
  } catch (error) {
    console.error('Error al crear el lugar en ruta:', error);
    res.status(500).json({ message: 'Error al crear el lugar en ruta' });
  }
};

// Función para actualizar una relación de lugar en ruta
const updatePlaceInRoute = async (req, res) => {
  const { Route_ID, Place_ID } = req.params;  // Obtener el ID de la ruta y el lugar desde los parámetros de la URL
  const { Order_Number } = req.body;

  try {
    // Buscar la relación por Route_ID y Place_ID
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

    // Actualizar la relación
    await sequelize.query(`
      UPDATE "ADMIN"."PlacesInRoute"
      SET "Order_Number" = :Order_Number, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Route_ID" = :Route_ID AND "Place_ID" = :Place_ID
    `, {
      replacements: { Order_Number, Route_ID, Place_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Relación de lugar en ruta actualizada correctamente' });  // Confirmación de actualización
  } catch (error) {
    console.error('Error al actualizar la relación de lugar en ruta:', error);
    res.status(500).json({ message: 'Error al actualizar la relación de lugar en ruta' });
  }
};

// Función para eliminar una relación de lugar en ruta
const deletePlaceInRoute = async (req, res) => {
  const { Route_ID, Place_ID } = req.params;

  try {
    // Buscar la relación por Route_ID y Place_ID
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

    // Eliminar la relación
    await sequelize.query(`
      DELETE FROM "ADMIN"."Places_in_Routes"
      WHERE "Route_ID" = :Route_ID AND "Place_ID" = :Place_ID
    `, {
      replacements: { Route_ID, Place_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Relación de lugar en ruta eliminada con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar la relación de lugar en ruta:', error);
    res.status(500).json({ message: 'Error al eliminar la relación de lugar en ruta' });
  }
};

module.exports = { getPlacesInRoutes, createPlaceInRoute, updatePlaceInRoute, deletePlaceInRoute };
