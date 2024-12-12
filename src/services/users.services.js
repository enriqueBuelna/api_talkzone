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
import { sendCodeEmailService } from "./email.services.js";
import { Follower } from "../models/follower.model.js";
import Op from "sequelize";
import { getFollowers, getFollowing } from "./followers.services.js";
// Servicio para registrar un usuario
export const registerUserService = async ({
  username,
  email,
  password,
  date_of_birth,
  gender,
}) => {
  (username, email, password, date_of_birth, gender);
  if (!username || !password || !email || !date_of_birth || !gender) {
    throw new Error("Todos los campos son obligatorios");
  }

  // Verificar si el nombre de usuario ya existe
  const nombreUsuarioExistente = await User.findOne({ where: { username } });
  if (nombreUsuarioExistente) {
    throw new Error("Este nombre de usuario ya está en uso");
  }

  // Hash de la contraseña
  const hashedPasswordd = await bcrypt.hash(password, 10);

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
    {
      id: user.id,
      username: user.username,
      user_role: user.user_role,
      is_profile_complete: user.is_profile_complete,
      is_banned: user.is_banned,
    },
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
    (user_preferences);
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

        // Crear las tags usando el id de la preferencia
        await Promise.all(
          preference.tag.map(async (tag) => {
            await createUserPreferenceTag(id, tag.id);
          })
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
    return "El correo ya está en uso";
  }

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) {
    return "El nombre de usuario ya está en uso";
  }

  await sendCodeEmailService(email, "Verificación de correo electrónico");
  return "Todo bien";
};

export const sendEmailPasswordChangeService = async ({ email }) => {
  const emailExists = await User.findOne({ where: { email } });

  if (!emailExists) {
    return "Ese correo electronico no esta registrado";
  }

  await sendCodeEmailService(email, "Restablecimiento de contraseña");
  return "Todo bien";
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

    (user);
    // // Verificar si el usuario existe
    // if (!user) {
    //   throw new Error("Usuario no encontrado");
    // }

    // // Actualizar el estado en línea (is_online) con la opción proporcionada
    // user.is_online = option;

    // // Guardar los cambios en la base de datos
    // await user.save();

    // return { message: `Usuario ${option ? "conectado" : "desconectado"}` };
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

export const getBasicInfoo = async (user_id) => {
  try {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: [
        "id",
        "username",
        "profile_picture",
        "gender",
        "is_verified",
      ],
    });
    return user;
  } catch (error) {
    (error);
  }
};

//obtener las preferencias del usuario completa

export const getUserPreferencess = async (userId) => {
  try {
    const userPreferences = await UserPreference.findAll({
      where: { user_id: userId, is_active: true },
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
          attributes: ["tag_id"],
        },
        {
          association: "user_preference_to_user",
          model: User,
          where: {
            is_banned: false,
          },
        },
      ],
      attributes: ["id", "type", "topic_id"],
    });

    if (userPreferences.length === 0) {
      return [];
    }
    return userPreferences;
  } catch (error) {
    console.error(error);
  }
};

//getUserProfileInformation

export const getUserProileInformation = async (user_id) => {
  try {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: [
        "username",
        "profile_picture",
        "is_online",
        "gender",
        "is_verified",
      ],
      raw: true,
    });
    return user;
  } catch (error) {
    (error);
  }
};

export const getFollowersFollowedd = async (user_id) => {
  try {
    // const followersFollowed = await
    const userFollowersAndFollowing = await User.findAll({
      include: [
        {
          model: Follower,
          as: "following", // Usuarios que el usuario sigue
          where: { follower_id: user_id },
          attributes: [],
          required: false,
        },
        // {
        //   model: Follower,
        //   as: "followers", // Usuarios que siguen al usuario
        //   where: { followed_id: user_id },
        //   attributes: [],
        //   required: false,
        // },
      ],
      attributes: ["id", "username", "profile_picture", "is_online", "gender"],
      raw: true,
    });

    // Filtrar usuarios únicos
    const uniqueUsers = Array.from(
      new Set(userFollowersAndFollowing.map((user) => user.id))
    )
      .map((id) => userFollowersAndFollowing.find((user) => user.id === id))
      .filter((user) => user.id !== user_id); // Excluir el usuario actual

    return uniqueUsers;
  } catch (error) {
    (error);
  }
};

export const getCompleteProfilee = async (user_id) => {
  try {
    const user = await User.findOne({
      where: { id: user_id, is_banned: false },
      attributes: [
        "id",
        "username",
        "profile_picture",
        "gender",
        "about_me",
        "cover_picture",
        "is_verified",
      ],
      include: [
        {
          model: UserPreference,
          where: { is_active: true },
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
            {
              model: UserPreferenceTag,
              include: [
                {
                  model: Tag,
                  attributes: ["tag_name"],
                },
              ],
              attributes: ["tag_id"],
            },
          ],
          attributes: ["id", "type", "topic_id"],
          required: false,
        },
        // Seguidores
      ],
    });

    let followers = await getFollowers(user_id);
    let following = await getFollowing(user_id);

    user.setDataValue("following", following);

    user.setDataValue("followers", followers);
    return user;
  } catch (error) {
    (error);
  }
};

export const editProfilee = async (
  user_id,
  profile_picture,
  cover_picture,
  about_me,
  username
) => {
  try {
    const user = await User.findByPk(user_id);
    user.profile_picture = profile_picture || user.profile_picture;
    user.about_me = about_me || user.about_me;
    user.username = username || user.username;
    user.cover_picture = cover_picture || user.cover_picture;
    // Guardar los cambios en el usuario
    await user.save();
    return user;
  } catch (error) {
    (error);
  }
};
