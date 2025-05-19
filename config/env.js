// config/env.js
module.exports = {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_CONNECT_STRING: process.env.DB_CONNECT_STRING,
  ssl: process.env.ssl === 'true',  // Convertir a booleano si es necesario
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },
};
