module.exports = (sequelize, Sequelize) => {
    const PlacesInRoute = sequelize.define('PlacesInRoute', {
      Route_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Routes',
          key: 'Route_ID',
        },
        allowNull: false,
        primaryKey: true,  // Primary key
      },
      Place_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TouristPlaces',
          key: 'Place_ID',
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
    PlacesInRoute.belongsTo(sequelize.models.TouristPlace, { foreignKey: 'Place_ID' });
  
    return PlacesInRoute;
  };
  