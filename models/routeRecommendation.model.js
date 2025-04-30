module.exports = (sequelize, Sequelize) => {
    const RouteRecommendation = sequelize.define('RouteRecommendation', {
      Recommendation_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Auto incrementable
      },
      Question_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Questions',  // Relación con la tabla "Questions"
          key: 'Question_ID',
        },
        allowNull: false,  // La relación con la pregunta es obligatoria
      },
      User_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',  // Relación con la tabla "Users"
          key: 'User_ID',
        },
        allowNull: false,  // La relación con el usuario es obligatoria
      },
      Route_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Routes',  // Relación con la tabla "Routes"
          key: 'Route_ID',
        },
        allowNull: false,  // La relación con la ruta es obligatoria
      },
      Answer: {
        type: Sequelize.STRING(4000),  // Respuesta del usuario
        allowNull: false,  // La respuesta es obligatoria
      },
      Date: {
        type: Sequelize.DATE,  // Fecha de la recomendación
        defaultValue: Sequelize.NOW,  // Fecha actual como valor por defecto
      },
    });
  
    // Relación con la tabla "Questions", "Users" y "Routes"
    RouteRecommendation.belongsTo(sequelize.models.Question, { foreignKey: 'Question_ID' });
    RouteRecommendation.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });
    RouteRecommendation.belongsTo(sequelize.models.Route, { foreignKey: 'Route_ID' });
  
    return RouteRecommendation;
  };
  