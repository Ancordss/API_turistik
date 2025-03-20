const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize

// Función para obtener todos los métodos de pago de un usuario
const getPaymentMethods = async (req, res) => {
  const { userId } = req.params;  // Obtener el ID del usuario desde los parámetros de la URL

  try {
    const [paymentMethods, metadata] = await sequelize.query(`
      SELECT
        pm."Payment_ID",
        pm."User_ID",
        pm."Amount",
        pm."Method",
        pm."Payment_Date",
        u."Name" AS "UserName"
      FROM
        "ADMIN"."PaymentMethods" pm
      JOIN
        "ADMIN"."Users" u ON u."User_ID" = pm."User_ID"
      WHERE
        pm."User_ID" = :userId
    `, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(paymentMethods);  // Devuelve los resultados obtenidos en formato JSON
  } catch (error) {
    console.error('Error al obtener los métodos de pago:', error);
    res.status(500).json({ message: 'Error al obtener los métodos de pago' });
  }
};

// Función para crear un nuevo método de pago
const createPaymentMethod = async (req, res) => {
  const { User_ID, Amount, Method } = req.body;

  try {
    const newPaymentMethod = await sequelize.query(`
      INSERT INTO "ADMIN"."PaymentMethods" 
        ("User_ID", "Amount", "Method", "Payment_Date", "createdAt", "updatedAt")
      VALUES 
        (:User_ID, :Amount, :Method, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING "Payment_ID", "User_ID", "Amount", "Method", "Payment_Date"
    `, {
      replacements: { User_ID, Amount, Method },
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json(newPaymentMethod[0]);  // Devolver el nuevo método de pago creado
  } catch (error) {
    console.error('Error al crear el método de pago:', error);
    res.status(500).json({ message: 'Error al crear el método de pago' });
  }
};

// Función para actualizar un método de pago
const updatePaymentMethod = async (req, res) => {
  const { Payment_ID } = req.params;  // Obtener el ID del método de pago desde los parámetros de la URL
  const { Amount, Method } = req.body;

  try {
    const paymentMethod = await sequelize.query(`
      SELECT * FROM "ADMIN"."PaymentMethods"
      WHERE "Payment_ID" = :Payment_ID
    `, {
      replacements: { Payment_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!paymentMethod || paymentMethod.length === 0) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }

    // Actualizar el método de pago
    await sequelize.query(`
      UPDATE "ADMIN"."PaymentMethods"
      SET "Amount" = :Amount, "Method" = :Method, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Payment_ID" = :Payment_ID
    `, {
      replacements: { Payment_ID, Amount, Method },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Método de pago actualizado correctamente' });  // Confirmación de actualización
  } catch (error) {
    console.error('Error al actualizar el método de pago:', error);
    res.status(500).json({ message: 'Error al actualizar el método de pago' });
  }
};

// Función para eliminar un método de pago
const deletePaymentMethod = async (req, res) => {
  const { Payment_ID } = req.params;

  try {
    const paymentMethod = await sequelize.query(`
      SELECT * FROM "ADMIN"."PaymentMethods"
      WHERE "Payment_ID" = :Payment_ID
    `, {
      replacements: { Payment_ID },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!paymentMethod || paymentMethod.length === 0) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }

    // Eliminar el método de pago
    await sequelize.query(`
      DELETE FROM "ADMIN"."PaymentMethods"
      WHERE "Payment_ID" = :Payment_ID
    `, {
      replacements: { Payment_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Método de pago eliminado con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar el método de pago:', error);
    res.status(500).json({ message: 'Error al eliminar el método de pago' });
  }
};

module.exports = { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod };
