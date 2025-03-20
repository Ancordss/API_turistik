// const { Sequelize } = require('sequelize');
// const env = require('./env');


// // Asegúrate de que los modelos estén correctamente importados
// // db.User = require('../models/user.model.js')(sequelize, Sequelize);
// // db.TouristPlace = require('../models/touristPlace.model.js')(sequelize, Sequelize);
// // db.Question = require('../models/question.model.js')(sequelize, Sequelize);
// // db.Question = require('../models/userPreference.model.js')(sequelize, Sequelize);


// // Función para sincronizar las tablas
// const syncDatabase = async () => {
//   try {
//     await sequelize.sync({ force: false }); // force: true eliminaría todas las tablas antes de recrearlas
//     console.log('Base de datos sincronizada correctamente');
//   } catch (error) {
//     console.error('Error al sincronizar la base de datos:', error);
//   }
// };

// module.exports = { sequelize, syncDatabase };
