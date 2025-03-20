// controllers/touristPlaceController.js

const { TouristPlace } = require('../config/config');  // Asegúrate de importar correctamente el modelo

// Función para obtener todos los lugares turísticos
const getTouristPlaces = async (req, res) => {
  try {
    const places = await TouristPlace.findAll();  // Obtener todos los lugares turísticos
    res.json(places);  // Devolver los lugares turísticos en formato JSON
  } catch (error) {
    console.error('Error al obtener los lugares turísticos:', error);
    res.status(500).json({ message: 'Error al obtener los lugares turísticos' });
  }
};

// Función para crear un nuevo lugar turístico
const createTouristPlace = async (req, res) => {
  const { Name, Description, Category, Location, Image, Coordinates } = req.body;

  try {
    const newPlace = await TouristPlace.create({
      Name,
      Description,
      Category,
      Location,
      Image,
      Coordinates,
    });

    res.status(201).json(newPlace);  // Devolver el lugar turístico creado
  } catch (error) {
    console.error('Error al crear el lugar turístico:', error);
    res.status(500).json({ message: 'Error al crear el lugar turístico' });
  }
};

// Función para actualizar un lugar turístico
const updateTouristPlace = async (req, res) => {
  const { Place_ID } = req.params;  // Obtener el ID del lugar desde los parámetros de la URL
  const { Name, Description, Category, Location, Image, Coordinates } = req.body;

  try {
    const place = await TouristPlace.findByPk(Place_ID);  // Buscar el lugar turístico por ID

    if (!place) {
      return res.status(404).json({ message: 'Lugar turístico no encontrado' });
    }

    // Actualizar los datos del lugar turístico
    place.Name = Name;
    place.Description = Description;
    place.Category = Category;
    place.Location = Location;
    place.Image = Image;
    place.Coordinates = Coordinates;

    await place.save();  // Guardar los cambios en la base de datos

    res.json(place);  // Devolver el lugar actualizado
  } catch (error) {
    console.error('Error al actualizar el lugar turístico:', error);
    res.status(500).json({ message: 'Error al actualizar el lugar turístico' });
  }
};

// Función para eliminar un lugar turístico
const deleteTouristPlace = async (req, res) => {
  const { Place_ID } = req.params;

  try {
    const place = await TouristPlace.findByPk(Place_ID);

    if (!place) {
      return res.status(404).json({ message: 'Lugar turístico no encontrado' });
    }

    await place.destroy();  // Eliminar el lugar turístico de la base de datos

    res.json({ message: 'Lugar turístico eliminado con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar el lugar turístico:', error);
    res.status(500).json({ message: 'Error al eliminar el lugar turístico' });
  }
};

module.exports = { getTouristPlaces, createTouristPlace, updateTouristPlace, deleteTouristPlace };
