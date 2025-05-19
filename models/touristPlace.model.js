// models/touristPlace.model.js

module.exports = (sequelize, Sequelize) => {
  const TouristPlace = sequelize.define('TouristPlace', {
    TouristPlace_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Asegúrate de que sea auto incremental
    },
    Places: {
      type: Sequelize.STRING(200),
      allowNull: false,  // El nombre del lugar no puede ser nulo
    },
    Raw_data: {
      type: Sequelize.JSON,  // Descripción del lugar, puede ser muy extensa
    },
    Category: {
      type: Sequelize.STRING(100),  // Categoría como 'playa', 'montaña', etc.
    },
    Location: {
      type: Sequelize.STRING(200),  // Ubicación (puede ser dirección o coordenadas geográficas)
    },
    Image: {
      type: Sequelize.STRING(200),  // Almacena la URL de la imagen como string
    },
    Coordinates: {
      type: Sequelize.STRING(200),  // Almacena las coordenadas como string (ej. 'lat, long')
    },
  });

  return TouristPlace;
};
