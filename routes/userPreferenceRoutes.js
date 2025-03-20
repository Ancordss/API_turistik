// routes/userPreferenceRoutes.js

const express = require('express');
const { getUserPreferences, createUserPreference, updateUserPreference, deleteUserPreference } = require('../controllers/userPreferenceController');  // Asegúrate de importar el controlador

const router = express.Router();

// Ruta para obtener todas las preferencias de usuario
router.get('/', getUserPreferences);

// Ruta para crear una nueva preferencia de usuario
router.post('/', createUserPreference);

// Ruta para actualizar una preferencia de usuario por ID
router.put('/:Preference_ID', updateUserPreference);

// Ruta para eliminar una preferencia de usuario por ID
router.delete('/:Preference_ID', deleteUserPreference);

module.exports = router;
