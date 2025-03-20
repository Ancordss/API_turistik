const express = require('express');
require('dotenv').config();
const { sequelize, syncDatabase } = require('./config/config');  // Asegúrate de importar sequelize correctamente
const userRoutes = require('./routes/userRoutes');  // Importa las rutas de usuario
const touristPlaceRoutes = require('./routes/touristPlaceRoutes');  // Importa las rutas de lugares turísticos
const questionRoutes = require('./routes/questionRoutes');  // Importa las rutas de preguntas
const userPreferenceRoutes = require('./routes/userPreferenceRoutes');  // Importa las rutas de preferencias de usuario
const routeRoutes = require('./routes/routes');  // Importa las rutas de rutas
const placesInRouteRoutes = require('./routes/placesInRouteRoutes');  // Importa las rutas de lugares en rutas
const ratingsCommentRoutes = require('./routes/ratingsCommentRoutes');  // Importa las rutas de calificaciones y comentarios
const routesHistoryRoutes = require('./routes/routesHistoryRoutes');  // Importa las rutas de historial de rutas
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');  // Importa las rutas de métodos de pago
const userAnswerRoutes = require('./routes/userAnswerRoutes');  // Importa las rutas de respuestas de usuario


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sincronizamos la base de datos al iniciar la API
async function startServer() {
  try {
    await syncDatabase();  // Sincroniza la base de datos antes de iniciar el servidor
    console.log('Base de datos sincronizada correctamente');
    
    // Usamos las rutas de usuario
    app.use('/api/users', userRoutes);
    app.use('/api/touristPlaces', touristPlaceRoutes);
    // Usamos las rutas de preguntas
    app.use('/api/questions', questionRoutes);
    // Usamos las rutas de preferencias de usuario
app.use('/api/userPreferences', userPreferenceRoutes);
 // Usamos las rutas de rutas
 app.use('/api/routes', routeRoutes);
     // Usamos las rutas de lugares en rutas
 app.use('/api/placesInRoutes', placesInRouteRoutes);

 app.use('/api/ratingsComments', ratingsCommentRoutes);  // Añadir la ruta
  // Usamos las rutas de historial de rutas
  app.use('/api/routesHistory', routesHistoryRoutes);

   // Usamos las rutas de métodos de pago
   app.use('/api/paymentMethods', paymentMethodRoutes);
    // Usamos las rutas de respuestas de usuario
    app.use('/api/userAnswers', userAnswerRoutes);



    // Iniciamos el servidor solo después de que la base de datos se haya sincronizado
    app.listen(PORT, () => {
      console.log(`API escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
}

startServer();  // Llamamos a la función para iniciar el servidor
