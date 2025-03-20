const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize

// Función para obtener todas las rutas
const getRoutes = async (req, res) => {
  try {
    // Consulta SQL corregida con comillas dobles para respetar la capitalización en Oracle
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

    res.json(routes);  // Devuelve las rutas obtenidas en formato JSON
  } catch (error) {
    console.error('Error al obtener las rutas:', error);
    res.status(500).json({ message: 'Error al obtener las rutas' });
  }
};

// Función para crear una nueva ruta
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

    res.status(201).json(newRoute[0]);  // Devolver la ruta creada
  } catch (error) {
    console.error('Error al crear la ruta:', error);
    res.status(500).json({ message: 'Error al crear la ruta' });
  }
};

// Función para actualizar una ruta
const updateRoute = async (req, res) => {
  const { Route_ID } = req.params;  // Obtener el ID de la ruta desde los parámetros de la URL
  const { User_ID, Route_Name, Description, Duration, Distance, Coordinates } = req.body;

  try {
    // Buscar la ruta por ID
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

    // Actualizar la ruta
    await sequelize.query(`
      UPDATE "ADMIN"."Routes"
      SET "User_ID" = :User_ID, "Route_Name" = :Route_Name, "Description" = :Description, 
          "Duration" = :Duration, "Distance" = :Distance, "Coordinates" = :Coordinates, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Route_ID" = :Route_ID
    `, {
      replacements: { User_ID, Route_Name, Description, Duration, Distance, Coordinates, Route_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Ruta actualizada correctamente' });  // Confirmación de actualización
  } catch (error) {
    console.error('Error al actualizar la ruta:', error);
    res.status(500).json({ message: 'Error al actualizar la ruta' });
  }
};

// Función para eliminar una ruta
const deleteRoute = async (req, res) => {
  const { Route_ID } = req.params;

  try {
    // Buscar la ruta por ID
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

    // Eliminar la ruta
    await sequelize.query(`
      DELETE FROM "ADMIN"."Routes" 
      WHERE "Route_ID" = :Route_ID
    `, {
      replacements: { Route_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Ruta eliminada con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar la ruta:', error);
    res.status(500).json({ message: 'Error al eliminar la ruta' });
  }
};

module.exports = { getRoutes, createRoute, updateRoute, deleteRoute };
