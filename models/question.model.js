module.exports = (sequelize, Sequelize) => {
  const Question = sequelize.define('Question', {
    Question_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Auto incrementable
    },
    Question_Text: {
      type: Sequelize.STRING(1000),  // Pregunta generada por la IA
      allowNull: false,  // No puede ser nula
    },
    AI_Logic: {
      type: Sequelize.STRING(2000),  // Lógica o algoritmo usado para generar la pregunta
      allowNull: false,  // No puede ser nula
    },
    Answer_Type: {
      type: Sequelize.STRING(50),  // Tipo de respuesta (ejemplo: "multiple_choice", "text", etc.)
      allowNull: false,  // No puede ser nula
    },
    Is_Active: {
      type: Sequelize.BOOLEAN,  // Indica si la pregunta está activa o no
      defaultValue: true,  // Por defecto es true
    },
    Date_Created: {
      type: Sequelize.DATE,  // Fecha de creación
      defaultValue: Sequelize.NOW,  // Establece la fecha actual como valor por defecto
    },
  });

  return Question;
};
