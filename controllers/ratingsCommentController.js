const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize

// Función para obtener todas las calificaciones y comentarios de los lugares
const getRatingsComments = async (req, res) => {
  try {
    const [ratingsComments, metadata] = await sequelize.query(`
      SELECT
        rc."Rating_ID",
        rc."User_ID",
        rc."Place_ID",
        rc."Rating",
        rc."Comment",
        rc."Date",
        u."Name" AS "UserName",
        p."Name" AS "PlaceName"
      FROM
        "ADMIN"."RatingsComments" rc
      JOIN
        "ADMIN"."Users" u ON u."User_ID" = rc."User_ID"
      JOIN
        "ADMIN"."TouristPlaces" p ON p."Place_ID" = rc."Place_ID"
    `);

    res.json(ratingsComments);  // Devuelve los resultados obtenidos en formato JSON
  } catch (error) {
    console.error('Error al obtener las calificaciones y comentarios:', error);
    res.status(500).json({ message: 'Error al obtener las calificaciones y comentarios' });
  }
};

// Función para crear una nueva calificación y comentario
const createRatingComment = async (req, res) => {
  const { User_ID, Place_ID, Rating, Comment } = req.body;

  try {
    const newRatingComment = await sequelize.query(`
      INSERT INTO "ADMIN"."RatingsComments" 
        ("User_ID", "Place_ID", "Rating", "Comment", "Date", "createdAt", "updatedAt")
      VALUES 
        (:User_ID, :Place_ID, :Rating, :Comment, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "Rating_ID", "User_ID", "Place_ID", "Rating", "Comment", "Date"
    `, {
      replacements: { User_ID, Place_ID, Rating, Comment },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newRatingComment[0]);  // Devolver la calificación y comentario creado
  } catch (error) {
    console.error('Error al crear la calificación y comentario:', error);
    res.status(500).json({ message: 'Error al crear la calificación y comentario' });
  }
};

// Función para actualizar una calificación y comentario
const updateRatingComment = async (req, res) => {
  const { Rating_ID } = req.params;  // Obtener el ID de la calificación desde los parámetros de la URL
  const { Rating, Comment } = req.body;

  try {
    const ratingComment = await sequelize.query(`
      SELECT * FROM "ADMIN"."RatingsComments"
      WHERE "Rating_ID" = :Rating_ID
    `, {
      replacements: { Rating_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!ratingComment || ratingComment.length === 0) {
      return res.status(404).json({ message: 'Calificación y comentario no encontrado' });
    }

    // Actualizar los datos de la calificación
    await sequelize.query(`
      UPDATE "ADMIN"."RatingsComments"
      SET "Rating" = :Rating, "Comment" = :Comment, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Rating_ID" = :Rating_ID
    `, {
      replacements: { Rating, Comment, Rating_ID },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Calificación y comentario actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar la calificación y comentario:', error);
    res.status(500).json({ message: 'Error al actualizar la calificación y comentario' });
  }
};

// Función para eliminar una calificación y comentario
const deleteRatingComment = async (req, res) => {
  const { Rating_ID } = req.params;

  try {
    const ratingComment = await sequelize.query(`
      SELECT * FROM "ADMIN"."RatingsComments"
      WHERE "Rating_ID" = :Rating_ID
    `, {
      replacements: { Rating_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!ratingComment || ratingComment.length === 0) {
      return res.status(404).json({ message: 'Calificación y comentario no encontrado' });
    }

    // Eliminar la calificación
    await sequelize.query(`
      DELETE FROM "ADMIN"."RatingsComments"
      WHERE "Rating_ID" = :Rating_ID
    `, {
      replacements: { Rating_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Calificación y comentario eliminados con éxito' });
  } catch (error) {
    console.error('Error al eliminar la calificación y comentario:', error);
    res.status(500).json({ message: 'Error al eliminar la calificación y comentario' });
  }
};

module.exports = { getRatingsComments, createRatingComment, updateRatingComment, deleteRatingComment };
