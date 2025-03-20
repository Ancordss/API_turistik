const express = require('express');
const { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } = require('../controllers/paymentMethodController');  // Asegúrate de importar el controlador

const router = express.Router();

// Ruta para obtener todos los métodos de pago de un usuario
router.get('/:userId', getPaymentMethods);

// Ruta para crear un nuevo método de pago
router.post('/', createPaymentMethod);

// Ruta para actualizar un método de pago por ID
router.put('/:Payment_ID', updatePaymentMethod);

// Ruta para eliminar un método de pago por ID
router.delete('/:Payment_ID', deletePaymentMethod);

module.exports = router;
