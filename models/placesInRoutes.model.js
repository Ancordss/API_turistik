module.exports = (sequelize, Sequelize) => {
    const PlacesInRoute = sequelize.define('PlacesInRoute', {
      PlacesInRoute_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Asegúrate de que sea auto incremental
      },
      Route_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Routes',
          key: 'Route_ID',
        },
        allowNull: false,
        primaryKey: true,  // Primary key
      },
      TouristPlace_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TouristPlaces',
          key: 'TouristPlace_ID',
        },
        allowNull: false,
        primaryKey: true,  // Primary key
      },
      Order_Number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  
    // Relación con las tablas Routes y Tourist_Places
    PlacesInRoute.belongsTo(sequelize.models.Route, { foreignKey: 'Route_ID' });
    PlacesInRoute.belongsTo(sequelize.models.TouristPlace, { foreignKey: 'TouristPlace_ID' });
  
    return PlacesInRoute;
  };
  