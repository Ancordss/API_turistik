// config/config.js
const { Sequelize } = require('sequelize');
const env = require('./env');  // Asegúrate de tener el archivo env.js que exporte las variables

console.log('Conexión a Oracle con los siguientes parámetros:');
console.log(`Host: ${env.DB_HOST}`);
console.log(`User: ${env.DB_USER}`);

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: 'oracle', // Usamos Oracle como dialecto
  dialectOptions: {
    connectString: env.DB_CONNECT_STRING, // Cadena de conexión a Oracle
    ssl: env.ssl, // Si es necesario habilitar SSL
  },
  pool: env.pool, // Configuración del pool de conexiones
});

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });  // `force: true` eliminará las tablas existentes
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

const db = {};

// Asignamos Sequelize y la instancia a db
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.syncDatabase = syncDatabase;  // Exportamos la función de sincronización

// Importación de modelos
db.User = require('../models/user.model.js')(sequelize, Sequelize);
db.TouristPlace = require('../models/touristPlace.model.js')(sequelize, Sequelize);
db.Question = require('../models/question.model.js')(sequelize, Sequelize);
db.UserPreference = require('../models/userPreference.model.js')(sequelize, Sequelize);
db.UserPreference = require('../models/routes.model.js')(sequelize, Sequelize);
db.UserPreference = require('../models/placesInRoutes.model.js')(sequelize, Sequelize);
db.UserPreference = require('../models/ratingsComment.model.js')(sequelize, Sequelize);
db.RoutesHistory = require('../models/routesHistory.model.js')(sequelize, Sequelize);
db.RoutesHistory = require('../models/paymentMethod.model.js')(sequelize, Sequelize);
db.RoutesHistory = require('../models/userAnswer.model.js')(sequelize, Sequelize);

module.exports = db;
