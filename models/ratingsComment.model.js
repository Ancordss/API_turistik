module.exports = (sequelize, Sequelize) => {
    const RatingsComment = sequelize.define('RatingsComment', {
      Rating_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Auto increment
      },
      User_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',  // Referencia a la tabla Users
          key: 'User_ID',
        },
        allowNull: false,  // El User_ID es obligatorio
      },
      Place_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TouristPlaces',  // Referencia a la tabla TouristPlaces
          key: 'Place_ID',
        },
        allowNull: false,  // El Place_ID es obligatorio
      },
      Rating: {
        type: Sequelize.INTEGER,
        allowNull: false,  // La calificación es obligatoria
        validate: {
          min: 1,  // Valor mínimo 1
          max: 5,  // Valor máximo 5
        },
      },
      Comment: {
        type: Sequelize.STRING(4000),
        allowNull: true,  // El comentario es opcional
      },
      Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Fecha actual por defecto
      },
    });
  
    // Relaciones
    RatingsComment.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });
    RatingsComment.belongsTo(sequelize.models.TouristPlace, { foreignKey: 'Place_ID' });
  
    return RatingsComment;
  };
  