const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/config');
const verifyToken = require('../middleware/verifyToken');  // Importar el middleware

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   birth_date:
 *                     type: string
 *                   user_type:
 *                     type: string
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();  
    res.json(users);  
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birth_date:
 *                 type: string
 *               user_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 birth_date:
 *                   type: string
 *                 user_type:
 *                   type: string
 */
const createUser = async (req, res) => {
  const { Name, Email, Password, Birth_Date, User_Type } = req.body;

  try {
    // Cifrar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await User.create({
      Name,
      Email,
      Password: hashedPassword, // Guardamos la contraseña cifrada
      Birth_Date,
      User_Type,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};


/**
 * @swagger
 * /api/users/{User_ID}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     parameters:
 *       - in: path
 *         name: User_ID
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birth_date:
 *                 type: string
 *               user_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
const updateUser = async (req, res) => {
  const { User_ID } = req.params;
  const { Name, Email, Password, Birth_Date, User_Type } = req.body;

  try {
    const user = await User.findByPk(User_ID);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.Name = Name;
    user.Email = Email;
    user.Password = Password;
    user.Birth_Date = Birth_Date;
    user.User_Type = User_Type;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

/**
 * @swagger
 * /api/users/{User_ID}:
 *   delete:
 *     summary: Eliminar un usuario
 *     parameters:
 *       - in: path
 *         name: User_ID
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
const deleteUser = async (req, res) => {
  const { User_ID } = req.params;

  try {
    const user = await User.findByPk(User_ID);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();

    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

const loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { userId: user.User_ID, userType: user.User_Type },  // Información que va en el token
      'mi_clave_secreta',  // Clave secreta para firmar el token
      { expiresIn: '1h' }  // El token expira en 1 hora
    );

    res.json({ token });  // Devuelve el token al cliente
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};



module.exports = { getUsers, createUser, updateUser, deleteUser, loginUser};
