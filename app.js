const express = require('express');
require('dotenv').config();
const cors = require('cors');
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
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const verifyToken = require('./middleware/verifyToken');  // Importar el middleware de verificación

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
app.use(cors({
  origin: '*', // En producción, cambiar por la URL específica del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Turistik',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar usuarios y lugares turísticos',
    },
  },
  apis: [
    './controllers/userController.js',          // Rutas de usuario
    './controllers/touristPlaceController.js',  // Rutas de lugares turísticos
    './controllers/questionController.js',      // Rutas de preguntas
    './controllers/userPreferenceController.js', // Rutas de preferencias de usuario
    './controllers/routeController.js',         // Rutas de rutas
    './controllers/placesInRouteController.js', // Rutas de lugares en rutas
    './controllers/ratingsCommentController.js', // Rutas de calificaciones y comentarios
    './controllers/routesHistoryController.js', // Rutas de historial de rutas
    './controllers/paymentMethodController.js', // Rutas de métodos de pago
    './controllers/userAnswerController.js'    // Rutas de respuestas de usuario
  ],
};

// Generar especificación Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Usar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Aquí tus rutas y configuración de la API
app.get('/', (req, res) => {
  res.send('API Turistik');
});

app.use(express.json());

// Sincronizamos la base de datos al iniciar la API
async function startServer() {
  try {
    await syncDatabase();  // Sincroniza la base de datos antes de iniciar el servidor
    console.log('Base de datos sincronizada correctamente');
    
    // Usamos las rutas de usuario
    app.use('/api/users', userRoutes);
    
    // Usamos las rutas de lugares turísticos
    app.use('/api/touristPlaces', touristPlaceRoutes);
    
    // Usamos las rutas de preguntas
    app.use('/api/questions', questionRoutes);
    
    // Usamos las rutas de preferencias de usuario
    app.use('/api/userPreferences', userPreferenceRoutes);
    
    // Usamos las rutas de rutas
    app.use('/api/routes', routeRoutes);
    
    // Usamos las rutas de lugares en rutas
    app.use('/api/placesInRoutes', placesInRouteRoutes);
    
    // Usamos las rutas de calificaciones y comentarios
    app.use('/api/ratingsComments', ratingsCommentRoutes);
    
    // Usamos las rutas de historial de rutas
    app.use('/api/routesHistory', routesHistoryRoutes);
    
    // Usamos las rutas de métodos de pago
    app.use('/api/paymentMethods', paymentMethodRoutes);
    
    // Usamos las rutas de respuestas de usuario
    app.use('/api/userAnswers', userAnswerRoutes);


    // app.use('/api/users', verifyToken, userRoutes);  // Aseguramos que las rutas de usuarios estén protegidas
    app.use('/api/users', userRoutes);
    // Rutas protegidas con verificación de token (por ejemplo, cualquier ruta que implique manejo de usuarios y rutas)

    app.use('/api/routes', verifyToken, routeRoutes);  // Aseguramos que las rutas de rutas estén protegidas
    app.use('/api/placesInRoutes', verifyToken, placesInRouteRoutes); // Protegemos rutas de lugares en rutas

    // Iniciamos el servidor solo después de que la base de datos se haya sincronizado
    app.listen(PORT, () => {
      console.log(`API escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
}

startServer();  // Llamamos a la función para iniciar el servidor

