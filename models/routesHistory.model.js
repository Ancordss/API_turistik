module.exports = (sequelize, Sequelize) => {
    const RoutesHistory = sequelize.define('RoutesHistory', {
      History_ID: {
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
      Route_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Routes',
          key: 'Route_ID',
        },
        allowNull: false,
      },
      Route_Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  
    // Relación con la tabla Users y Routes
    RoutesHistory.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });
    RoutesHistory.belongsTo(sequelize.models.Route, { foreignKey: 'Route_ID' });
  
    return RoutesHistory;
  };
  