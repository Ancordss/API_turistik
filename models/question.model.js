// models/question.model.js

module.exports = (sequelize, Sequelize) => {
  const Question = sequelize.define('Question', {
    Question_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Asegúrate de que sea auto incremental
    },
    Place_ID: {
      type: Sequelize.INTEGER,
      references: {
        model: 'TouristPlaces',  // Hace referencia a la tabla Tourist_Places
        key: 'Place_ID',
      },
      allowNull: false,  // El Place_ID es obligatorio
    },
    Question_Text: {
      type: Sequelize.STRING(1000),  // La pregunta puede ser bastante extensa
      allowNull: false,  // La pregunta no puede ser nula
    },
    Answer_Type: {
      type: Sequelize.STRING(50),  // El tipo de respuesta puede ser 'multiple_choice', 'text', etc.
    },
  });

  // Establecer la relación con el modelo TouristPlace
  Question.belongsTo(sequelize.models.TouristPlace, { foreignKey: 'Place_ID' });

  return Question;
};
