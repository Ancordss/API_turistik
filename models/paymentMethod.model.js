module.exports = (sequelize, Sequelize) => {
    const PaymentMethod = sequelize.define('PaymentMethod', {
      Payment_ID: {
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
      Amount: {
        type: Sequelize.NUMBER,
        allowNull: false,  // El monto es obligatorio
      },
      Method: {
        type: Sequelize.STRING(50),  // El método de pago (ej. "credit card", "PayPal", etc.)
        allowNull: false,  // El método es obligatorio
      },
      Payment_Date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Fecha de pago por defecto (fecha actual)
      },
    });
  
    // Relación con la tabla 'Users'
    PaymentMethod.belongsTo(sequelize.models.User, { foreignKey: 'User_ID' });
  
    return PaymentMethod;
  };
  