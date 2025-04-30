module.exports = (sequelize, Sequelize) => {
    const QuestionDetail = sequelize.define('QuestionDetail', {
      Detail_ID: {
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
      Option_Text: {
        type: Sequelize.STRING(1000),  // Opciones de respuesta (solo para preguntas de tipo múltiple)
        allowNull: true,  // No es obligatorio (si no es una pregunta de tipo múltiple)
      },
      Route_Recommendation_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Routes',  // Relación con la tabla "Routes"
          key: 'Route_ID',
        },
        allowNull: true,  // Puede ser nulo si no hay una recomendación de ruta
      },
      Response_Logic: {
        type: Sequelize.STRING(2000),  // Lógica de cómo la respuesta influye en la recomendación de rutas
        allowNull: true,  // No es obligatorio
      },
      Is_Active: {
        type: Sequelize.BOOLEAN,  // Si la opción de respuesta está activa
        defaultValue: true,  // Por defecto es verdadero
      },
      Date_Created: {
        type: Sequelize.DATE,  // Fecha de creación
        defaultValue: Sequelize.NOW,  // Fecha actual como valor por defecto
      },
    });
  
    // Relación con la tabla "Questions" y "Routes"
    QuestionDetail.belongsTo(sequelize.models.Question, { foreignKey: 'Question_ID' });
    QuestionDetail.belongsTo(sequelize.models.Route, { foreignKey: 'Route_Recommendation_ID' });
  
    return QuestionDetail;
  };
  