module.exports = (sequelize, Sequelize) => {
  const Route = sequelize.define('Route', {
    Route_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    User_ID: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'User_ID',
      },
      allowNull: false,  // Este campo no puede ser nulo
    },
    Route_Name: {
      type: Sequelize.STRING(200),
      allowNull: false,  // Este campo no puede ser nulo
    },
    Description: {
      type: Sequelize.STRING(4000),
      allowNull: true,
    },
    Registration_Date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    Duration: {
      type: Sequelize.STRING,  // Duración en formato string
      allowNull: true,
    },
    Distance: {
      type: Sequelize.STRING(20),  // Distancia como string (Ej: "15.5 km")
      allowNull: true,
    },
    Coordinates: {
      type: Sequelize.STRING(200),  // Coordenadas como string (Ej: "14.6349,-90.5550")
      allowNull: true,
    },
  });

  Route.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });

  return Route;
};
