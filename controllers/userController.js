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
 *                   Name:
 *                     type: string
 *                   Email:
 *                     type: string
 *                   Password:
 *                     type: string
 *                   Birth_Date:
 *                     type: string
 *                   User_Type:
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
 *               Name:
 *                 type: string
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *               Birth_Date:
 *                 type: string
 *               User_Type:
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
 *                 Name:
 *                   type: string
 *                 Email:
 *                   type: string
 *                 Password:
 *                   type: string
 *                 Birth_Date:
 *                   type: string
 *                 User_Type:
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
 * /api/user/{User_ID}:
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
 *               Name:
 *                 type: string
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *               Birth_Date:
 *                 type: string
 *               User_Type:
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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Autentica un usuario y devuelve un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - Password
 *             properties:
 *               Email:
 *                 type: string
 *                 format: email
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     Name:
 *                       type: string
 *                     Email:
 *                       type: string
 *                     User_Type:
 *                       type: string
 *       401:
 *         description: Credenciales inválidas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Buscar al usuario por su correo electrónico
    console.log(Email, Password);
    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log(user);
    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    console.log(isPasswordValid);
    // Generar un token JWT
    const token = jwt.sign(
      {
        userId: user.User_ID,
        userType: user.User_Type,
        email: user.Email
      },
      process.env.JWT_SECRET || 'mi_clave_secreta',  // Usar variable de entorno o fallback
      { expiresIn: '24h' }  // El token expira en 24 horas
    );

    // Devolver el token y la información básica del usuario
    res.json({
      token,
      user: {
        id: user.User_ID,
        name: user.Name,
        email: user.Email,
        userType: user.User_Type
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

/**
 * @swagger
 * /api/users/answered/{User_ID}/{Question_ID}:
 *   get:
 *     summary: Verificar si el usuario ya respondió una pregunta
 *     parameters:
 *       - in: path
 *         name: User_ID
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *       - in: path
 *         name: Question_ID
 *         required: true
 *         description: ID de la pregunta
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answered:
 *                   type: boolean
 *                   description: Indica si el usuario ha respondido la pregunta
 *       404:
 *         description: Usuario o pregunta no encontrados
 *       500:
 *         description: Error interno del servidor
 */
 const checkUserAnswer = async (req, res) => {
  const { User_ID, Question_ID } = req.params;

  try {
    // Verificar si existe una respuesta para esta pregunta por parte de este usuario
    const answer = await sequelize.models.UserAnswer.findOne({
      where: {
        User_ID,
        Question_ID
      }
    });

    // Si se encuentra una respuesta, significa que el usuario ya respondió esa pregunta
    if (answer) {
      return res.json({ answered: true });
    }

    // Si no se encuentra una respuesta, el usuario no ha respondido la pregunta
    return res.json({ answered: false });
  } catch (error) {
    console.error('Error al verificar respuesta del usuario:', error);
    res.status(500).json({ message: 'Error al verificar la respuesta del usuario' });
  }
};


module.exports = { getUsers, createUser, updateUser, deleteUser, loginUser, checkUserAnswer};
