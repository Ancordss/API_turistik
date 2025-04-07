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
 * /api/ratingsComments:
 *   get:
 *     summary: Obtener todas las calificaciones y comentarios de los lugares
 *     responses:
 *       200:
 *         description: Lista de calificaciones y comentarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rating_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   place_id:
 *                     type: integer
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *                   date:
 *                     type: string
 *                   user_name:
 *                     type: string
 *                   place_name:
 *                     type: string
 */
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

    res.json(ratingsComments);
  } catch (error) {
    console.error('Error al obtener las calificaciones y comentarios:', error);
    res.status(500).json({ message: 'Error al obtener las calificaciones y comentarios' });
  }
};

/**
 * @swagger
 * /api/ratingsComments:
 *   post:
 *     summary: Crear una nueva calificación y comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               place_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Calificación y comentario creados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rating_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 place_id:
 *                   type: integer
 *                 rating:
 *                   type: integer
 *                 comment:
 *                   type: string
 *                 date:
 *                   type: string
 */
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

    res.status(201).json(newRatingComment[0]);
  } catch (error) {
    console.error('Error al crear la calificación y comentario:', error);
    res.status(500).json({ message: 'Error al crear la calificación y comentario' });
  }
};

/**
 * @swagger
 * /api/ratingsComments/{Rating_ID}:
 *   put:
 *     summary: Actualizar una calificación y comentario
 *     parameters:
 *       - in: path
 *         name: Rating_ID
 *         required: true
 *         description: ID de la calificación y comentario a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Calificación y comentario actualizados correctamente
 *       404:
 *         description: Calificación y comentario no encontrado
 */
const updateRatingComment = async (req, res) => {
  const { Rating_ID } = req.params;
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

/**
 * @swagger
 * /api/ratingsComments/{Rating_ID}:
 *   delete:
 *     summary: Eliminar una calificación y comentario
 *     parameters:
 *       - in: path
 *         name: Rating_ID
 *         required: true
 *         description: ID de la calificación y comentario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Calificación y comentario eliminados con éxito
 *       404:
 *         description: Calificación y comentario no encontrado
 */
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
