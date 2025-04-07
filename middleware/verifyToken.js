const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    // Eliminar el prefijo "Bearer " del token
    const tokenWithoutBearer = token.replace('Bearer ', '');
    
    // Verificar el token usando la clave secreta
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Agregar el usuario verificado al objeto request para usarlo en las siguientes funciones
    req.user = verified;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Token no válido.' });
  }
};

module.exports = verifyToken;
