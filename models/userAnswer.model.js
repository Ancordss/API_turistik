module.exports = (sequelize, Sequelize) => {
    const UserAnswer = sequelize.define('UserAnswer', {
      Answer_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Asegúrate de que sea auto incremental
      },
      User_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'User_ID',
        },
        allowNull: false,
      },
      Question_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Questions',
          key: 'Question_ID',
        },
        allowNull: false,
      },
      Answer: {
        type: Sequelize.STRING(4000),  // Respuesta dada por el usuario
        allowNull: false,  // La respuesta es obligatoria
      },
      Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Fecha por defecto (fecha actual)
      },
    });
  
    // Relación con las tablas Users y Questions
    UserAnswer.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });
    UserAnswer.belongsTo(sequelize.models.Question, { foreignKey: 'Question_ID' });
  
    return UserAnswer;
  };
  