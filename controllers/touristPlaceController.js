const { TouristPlace } = require('../config/config');  // Asegúrate de importar correctamente el modelo
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
 * /api/touristPlaces:
 *   get:
 *     summary: Obtener todos los lugares turísticos
 *     responses:
 *       200:
 *         description: Lista de lugares turísticos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Place_ID:
 *                     type: integer
 *                   Name:
 *                     type: string
 *                   Description:
 *                     type: string
 *                   Category:
 *                     type: string
 *                   Location:
 *                     type: string
 *                   Image:
 *                     type: string
 *                   Coordinates:
 *                     type: string
 */
const getTouristPlaces = async (req, res) => {
  try {
    const places = await TouristPlace.findAll();
    res.json(places);
  } catch (error) {
    console.error('Error al obtener los lugares turísticos:', error);
    res.status(500).json({ message: 'Error al obtener los lugares turísticos' });
  }
};

/**
 * @swagger
 * /api/touristPlaces:
 *   post:
 *     summary: Crear un nuevo lugar turístico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               Category:
 *                 type: string
 *               Location:
 *                 type: string
 *               Image:
 *                 type: string
 *               Coordinates:
 *                 type: string
 *             required:
 *               - Name
 *               - Description
 *               - Category
 *               - Location
 *               - Image
 *               - Coordinates
 *     responses:
 *       201:
 *         description: Lugar turístico creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Place_ID:
 *                   type: integer
 *                 Name:
 *                   type: string
 *                 Description:
 *                   type: string
 *                 Category:
 *                   type: string
 *                 Location:
 *                   type: string
 *                 Image:
 *                   type: string
 *                 Coordinates:
 *                   type: string
 */
const createTouristPlace = async (req, res) => {
  const { Name, Description, Category, Location, Image, Coordinates } = req.body;

  try {
    const newPlace = await TouristPlace.create({
      Name,
      Description,
      Category,
      Location,
      Image,   // Almacena la URL o dirección de la imagen
      Coordinates,  // Almacena las coordenadas como un string
    });

    res.status(201).json(newPlace);
  } catch (error) {
    console.error('Error al crear el lugar turístico:', error);
    res.status(500).json({ message: 'Error al crear el lugar turístico' });
  }
};

/**
 * @swagger
 * /api/touristPlaces/{Place_ID}:
 *   put:
 *     summary: Actualizar un lugar turístico existente
 *     parameters:
 *       - in: path
 *         name: Place_ID
 *         required: true
 *         description: ID del lugar turístico a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Description:
 *                 type: string
 *               Category:
 *                 type: string
 *               Location:
 *                 type: string
 *               Image:
 *                 type: string
 *               Coordinates:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lugar turístico actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Place_ID:
 *                   type: integer
 *                 Name:
 *                   type: string
 *                 Description:
 *                   type: string
 *                 Category:
 *                   type: string
 *                 Location:
 *                   type: string
 *                 Image:
 *                   type: string
 *                 Coordinates:
 *                   type: string
 *       404:
 *         description: Lugar turístico no encontrado
 */
const updateTouristPlace = async (req, res) => {
  const { Place_ID } = req.params;
  const { Name, Description, Category, Location, Image, Coordinates } = req.body;

  try {
    const place = await TouristPlace.findByPk(Place_ID);

    if (!place) {
      return res.status(404).json({ message: 'Lugar turístico no encontrado' });
    }

    place.Name = Name;
    place.Description = Description;
    place.Category = Category;
    place.Location = Location;
    place.Image = Image;
    place.Coordinates = Coordinates;

    await place.save();

    res.json(place);
  } catch (error) {
    console.error('Error al actualizar el lugar turístico:', error);
    res.status(500).json({ message: 'Error al actualizar el lugar turístico' });
  }
};

/**
 * @swagger
 * /api/touristPlaces/{Place_ID}:
 *   delete:
 *     summary: Eliminar un lugar turístico
 *     parameters:
 *       - in: path
 *         name: Place_ID
 *         required: true
 *         description: ID del lugar turístico a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lugar turístico eliminado con éxito
 *       404:
 *         description: Lugar turístico no encontrado
 */
const deleteTouristPlace = async (req, res) => {
  const { Place_ID } = req.params;

  try {
    const place = await TouristPlace.findByPk(Place_ID);

    if (!place) {
      return res.status(404).json({ message: 'Lugar turístico no encontrado' });
    }

    await place.destroy();

    res.json({ message: 'Lugar turístico eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el lugar turístico:', error);
    res.status(500).json({ message: 'Error al eliminar el lugar turístico' });
  }
};

module.exports = { getTouristPlaces, createTouristPlace, updateTouristPlace, deleteTouristPlace };
