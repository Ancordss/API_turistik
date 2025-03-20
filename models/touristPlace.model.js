// models/touristPlace.model.js

module.exports = (sequelize, Sequelize) => {
  const TouristPlace = sequelize.define('TouristPlace', {
    Place_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Asegúrate de que sea auto incremental
    },
    Name: {
      type: Sequelize.STRING(200),
      allowNull: false,  // El nombre del lugar no puede ser nulo
    },
    Description: {
      type: Sequelize.STRING(4000),  // Descripción del lugar, puede ser muy extensa
    },
    Category: {
      type: Sequelize.STRING(100),  // Categoría como 'playa', 'montaña', etc.
    },
    Location: {
      type: Sequelize.STRING(200),  // Ubicación (puede ser dirección o coordenadas geográficas)
    },
    Image: {
      type: Sequelize.BLOB,  // Almacenará imágenes en formato BLOB
    },
    Coordinates: {
      type: Sequelize.GEOMETRY('POINT'),  // Tipo de datos para coordenadas geográficas (latitud y longitud)
    },
  });

  return TouristPlace;
};
