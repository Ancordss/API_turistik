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
        allowNull: false,
      },
      Route_Name: {
        type: Sequelize.STRING(200),
        allowNull: false,
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
        type: Sequelize.INTEGER, // Duración en minutos u horas
        allowNull: true,
      },
      Distance: {
        type: Sequelize.INTEGER, // Distancia en kilómetros
        allowNull: true,
      },
      Coordinates: {
        type: Sequelize.GEOMETRY('POINT'), // Para almacenar coordenadas espaciales
        allowNull: true,
      },
    });
  
    // Relación con la tabla User (Foreign Key)
    Route.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });
  
    return Route;
  };
  