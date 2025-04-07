const { sequelize } = require('../config/config');  // Asegúrate de importar correctamente sequelize
const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  // Obtener el token de los encabezados
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no encontrado' });
  }

  // Verificar el token
  try {
    const decoded = jwt.verify(token, 'mi_clave_secreta');
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();  // Pasa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { verifyToken };



/**
 * @swagger
 * /api/paymentMethods/{userId}:
 *   get:
 *     summary: Obtener todos los métodos de pago de un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario cuyos métodos de pago se desean obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de métodos de pago obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   payment_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   amount:
 *                     type: number
 *                     format: float
 *                   method:
 *                     type: string
 *                   payment_date:
 *                     type: string
 *                   user_name:
 *                     type: string
 */
const getPaymentMethods = async (req, res) => {
  const { userId } = req.params;

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

    res.json(paymentMethods);
  } catch (error) {
    console.error('Error al obtener los métodos de pago:', error);
    res.status(500).json({ message: 'Error al obtener los métodos de pago' });
  }
};

/**
 * @swagger
 * /api/paymentMethods:
 *   post:
 *     summary: Crear un nuevo método de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 format: float
 *               method:
 *                 type: string
 *     responses:
 *       201:
 *         description: Método de pago creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 amount:
 *                   type: number
 *                   format: float
 *                 method:
 *                   type: string
 *                 payment_date:
 *                   type: string
 */
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

    res.status(201).json(newPaymentMethod[0]);
  } catch (error) {
    console.error('Error al crear el método de pago:', error);
    res.status(500).json({ message: 'Error al crear el método de pago' });
  }
};

/**
 * @swagger
 * /api/paymentMethods/{Payment_ID}:
 *   put:
 *     summary: Actualizar un método de pago
 *     parameters:
 *       - in: path
 *         name: Payment_ID
 *         required: true
 *         description: ID del método de pago a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *               method:
 *                 type: string
 *     responses:
 *       200:
 *         description: Método de pago actualizado correctamente
 *       404:
 *         description: Método de pago no encontrado
 */
const updatePaymentMethod = async (req, res) => {
  const { Payment_ID } = req.params;
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

    await sequelize.query(`
      UPDATE "ADMIN"."PaymentMethods"
      SET "Amount" = :Amount, "Method" = :Method, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "Payment_ID" = :Payment_ID
    `, {
      replacements: { Payment_ID, Amount, Method },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.json({ message: 'Método de pago actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el método de pago:', error);
    res.status(500).json({ message: 'Error al actualizar el método de pago' });
  }
};

/**
 * @swagger
 * /api/paymentMethods/{Payment_ID}:
 *   delete:
 *     summary: Eliminar un método de pago
 *     parameters:
 *       - in: path
 *         name: Payment_ID
 *         required: true
 *         description: ID del método de pago a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Método de pago eliminado con éxito
 *       404:
 *         description: Método de pago no encontrado
 */
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

    await sequelize.query(`
      DELETE FROM "ADMIN"."PaymentMethods"
      WHERE "Payment_ID" = :Payment_ID
    `, {
      replacements: { Payment_ID },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({ message: 'Método de pago eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el método de pago:', error);
    res.status(500).json({ message: 'Error al eliminar el método de pago' });
  }
};

module.exports = { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod };
