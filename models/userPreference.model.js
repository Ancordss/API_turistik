// models/userPreference.model.js
module.exports = (sequelize, Sequelize) => {
    const UserPreference = sequelize.define('UserPreference', {
      Preference_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Asegúrate de que sea auto incremental
      },
      User_ID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',  // Referencia a la tabla Users
          key: 'User_ID',
        },
        allowNull: false,  // El User_ID es obligatorio
      },
      Category: {
        type: Sequelize.STRING(100),  // La categoría de la preferencia (playa, museos, etc.)
        allowNull: false,  // La categoría no puede ser nula
      },
      Description: {
        type: Sequelize.STRING(100),  // Descripción de la preferencia
        allowNull: false,  // La descripción no puede ser nula
      },
      Registration_Date: {
        type: Sequelize.DATE,  // Fecha de registro
        defaultValue: Sequelize.NOW,  // Fecha actual como valor por defecto
      },
    });
  
    // Establecer la relación con el modelo User
    UserPreference.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });
  
    return UserPreference;
  };
  