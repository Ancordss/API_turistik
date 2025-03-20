// models/user.model.js

// Definición del modelo de Usuario en Sequelize
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    User_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Asegúrate de que sea auto incremental
    },
    Name: {
      type: Sequelize.STRING(100),
      allowNull: false,  // El nombre no puede ser nulo
    },
    Email: {
      type: Sequelize.STRING(100),
      unique: true,  // Email único
      allowNull: false,  // El email no puede ser nulo
    },
    Password: {
      type: Sequelize.STRING(255),
      allowNull: false,  // La contraseña no puede ser nula
    },
    Registration_Date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,  // Fecha de registro con valor por defecto a la fecha y hora actual
    },
    Birth_Date: {
      type: Sequelize.DATE,  // Fecha de nacimiento
    },
    User_Type: {
      type: Sequelize.STRING(50),  // Tipo de usuario, como 'tourist' o 'admin'
    },
  });

  return User;  // Exportamos el modelo para usarlo en otras partes de la aplicación
};
