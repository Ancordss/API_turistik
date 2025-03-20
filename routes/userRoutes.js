// routes/userRoutes.js

const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');  // Asegúrate de importar el controlador

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/', getUsers);

// Ruta para crear un nuevo usuario
router.post('/', createUser);

// Ruta para actualizar un usuario por ID
router.put('/:User_ID', updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/:User_ID', deleteUser);

module.exports = router;
