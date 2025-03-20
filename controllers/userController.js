// controllers/userController.js

const { User } = require('../config/config');  // Asegúrate de que estás importando el modelo User

// Función para obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();  // Obtener todos los usuarios
    res.json(users);  // Devolver los usuarios en formato JSON
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// Función para crear un nuevo usuario
const createUser = async (req, res) => {
  const { Name, Email, Password, Birth_Date, User_Type } = req.body;

  try {
    const newUser = await User.create({
      Name,
      Email,
      Password,
      Birth_Date,
      User_Type,
    });

    res.status(201).json(newUser);  // Devolver el usuario creado
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

// Función para actualizar un usuario
const updateUser = async (req, res) => {
  const { User_ID } = req.params;  // Obtener el ID del usuario desde los parámetros de la URL
  const { Name, Email, Password, Birth_Date, User_Type } = req.body;

  try {
    const user = await User.findByPk(User_ID);  // Buscar al usuario por ID

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los datos del usuario
    user.Name = Name;
    user.Email = Email;
    user.Password = Password;
    user.Birth_Date = Birth_Date;
    user.User_Type = User_Type;

    await user.save();  // Guardar los cambios en la base de datos

    res.json(user);  // Devolver el usuario actualizado
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Función para eliminar un usuario
const deleteUser = async (req, res) => {
  const { User_ID } = req.params;

  try {
    const user = await User.findByPk(User_ID);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();  // Eliminar el usuario de la base de datos

    res.json({ message: 'Usuario eliminado con éxito' });  // Confirmación de eliminación
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
