import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserPreference } from "../models/user_preferences.model.js";
import { where } from "sequelize";
import { createUserPreference } from "./user_preferences.services.js";
import { createUserPreferenceTag } from "./user_preferences_tag.services.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { Topic } from "../models/topic.models.js";
import { Tag } from "../models/tag.models.js";

// Servicio para registrar un usuario
export const registerUserService = async ({
  username,
  email,
  hashedPassword,
  date_of_birth,
  gender,
}) => {
  if (!username || !hashedPassword || !email || !date_of_birth || !gender) {
    throw new Error("Todos los campos son obligatorios");
  }

  // Verificar si el nombre de usuario ya existe
  const nombreUsuarioExistente = await User.findOne({ where: { username } });
  if (nombreUsuarioExistente) {
    throw new Error("Este nombre de usuario ya está en uso");
  }

  // Hash de la contraseña
  const hashedPasswordd = await bcrypt.hash(hashedPassword, 10);

  // Crear el nuevo usuario
  const nuevoUsuario = await User.create({
    username,
    email,
    date_of_birth,
    gender,
    hashedPassword: hashedPasswordd,
  });

  return nuevoUsuario.id;
};

// Servicio para loguear al usuario
export const loginUserService = async ({ username, password }) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error("Usuario no encontrado");

  const token = jwt.sign(
    { id: user.id, username: user.username, user_role: user.user_role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) throw new Error("Password incorrecto");

  const { password: _, ...publicUser } = user.dataValues;
  return { publicUser, token };
};

// Servicio para completar el perfil del usuario
export const finishProfileService = async ({
  user_id,
  about_me,
  profile_picture,
  user_preferences,
  user_preferences_tag,
}) => {
  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Mapeo de las preferencias del usuario, procesando en paralelo las preferencias y sus tags
    const idUserPreferences = await Promise.all(
      user_preferences.map(async (preference) => {
        // Crear user_preference y obtener el id
        const { id } = await createUserPreference(
          user_id,
          preference.topic_id,
          preference.type
        );

        // Filtrar las tags que coinciden con esta preferencia
        const tags = user_preferences_tag.filter(
          (tag) => tag.index_preference === preference.index
        );

        // Crear las tags usando el id de la preferencia
        await Promise.all(
          tags.map((tag) => createUserPreferenceTag(id, tag.tag_id))
        );

        return id;
      })
    );

    // Actualización de perfil del usuario
    user.profile_picture = profile_picture || user.profile_picture;
    user.about_me = about_me || user.about_me;

    // Guardar los cambios en el usuario
    await user.save();
  } catch (error) {
    console.error(error);
  }
};

// Servicio para validar el pre-registro
export const validatePreRegisterService = async ({ email, username }) => {
  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) {
    throw new Error("El correo ya está en uso");
  }

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) {
    throw new Error("El nombre de usuario ya está en uso");
  }

  return "El correo y el nombre de usuario están disponibles";
};

// Servicio para obtener todos los usuarios
export const getAllUsersService = async () => {
  const users = await User.findAll({ attributes: ["username"] });
  return users;
};

//Servicio cambiar mi estado de offline a online
export const changeOnline = async (id, option) => {
  try {
    // Buscar el usuario por su ID
    const user = await User.findOne({
      where: { id },
    });

    // Verificar si el usuario existe
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizar el estado en línea (is_online) con la opción proporcionada
    user.is_online = option;

    // Guardar los cambios en la base de datos
    await user.save();

    return { message: `Usuario ${option ? "conectado" : "desconectado"}` };
  } catch (error) {
    throw new Error(`Error al cambiar el estado en línea: ${error.message}`);
  }
};

export const getUserOnline = async (id, option) => {
  try {
    // Buscar el usuario por su ID
    const user = await User.findOne({
      where: { id },
    });

    // Verificar si el usuario existe
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizar el estado en línea (is_online) con la opción proporcionada
    user.is_online = option;

    // Guardar los cambios en la base de datos
    await user.save();

    return { message: `Usuario ${option ? "conectado" : "desconectado"}` };
  } catch (error) {
    throw new Error(`Error al cambiar el estado en línea: ${error.message}`);
  }
};

//obtener las preferencias del usuario completa

export const getUserPreferencess = async (userId) => {
  try {
    const userPreferences = await UserPreference.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Topic, // Incluir el nombre del tema
          attributes: ["topic_name"], // Solo selecciona el nombre del tema
        },
        {
          model: UserPreferenceTag, // Incluir las etiquetas
          include: [
            {
              model: Tag,
              attributes: ["tag_name"], // Solo selecciona el nombre de las etiquetas
            },
          ],
        },
      ],
    });

    if (userPreferences.length === 0) {
      return null;
    }
    return userPreferences;
  } catch (error) {
    console.error(error);
  }
};
