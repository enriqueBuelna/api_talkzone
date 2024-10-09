// follower.service.js
import { User } from "../models/user.model.js";
import { Follower } from "../models/follower.model.js";

// Seguir a un usuario
export const followUser = async (follower_id, followed_id) => {
  // Verifica que los usuarios no sean los mismos
  if (follower_id === followed_id) {
    throw new Error("No puedes seguirte a ti mismo");
  }

  // Verifica que la relación no exista
  const existingFollow = await Follower.findOne({
    where: { follower_id, followed_id },
  });
  if (existingFollow) {
    throw new Error("Ya sigues a este usuario");
  }

  // Crea la relación de seguimiento
  const newFollow = await Follower.create({ follower_id, followed_id });
  return newFollow;
};

// Dejar de seguir a un usuario
export const unfollowUser = async (follower_id, followed_id) => {
  // Elimina la relación de seguimiento
  const result = await Follower.destroy({
    where: { follower_id, followed_id },
  });

  if (!result) {
    throw new Error("No sigues a este usuario");
  }

  return { message: "Has dejado de seguir al usuario" };
};

// Listar a los seguidores de un usuario
export const getFollowers = async (user_id) => {
  const followers = await Follower.findAll({
    where: { followed_id: user_id },
    include: [{ model: User, as: "follower" }],
  });

  return followers;
};

// Listar a los usuarios seguidos por un usuario
export const getFollowing = async (id) => {
  const following = await Follower.findAll({
    where: { follower_id: id },
    include: [
      {
        model: User,
        as: "followedId", // Asegúrate de que este alias coincida con tu definición de relación
        attributes: ["id", "username", "profile_picture"], // Selecciona solo los campos deseados
      },
    ],
  });

  // Mapear los resultados para obtener solo la información necesaria
  const usersFollowing = following.map((follow) => follow.followedId);

  return usersFollowing;
};

export const getOnlineFollowers = async (userId) => {
  try {
    // Obtener todos los seguidores en línea de un usuario
    const onlineFollowers = await Follower.findAll({
      where: { followed_id: userId }, // Filtra por los usuarios que siguen a `userId`
      include: [
        {
          model: User, // Incluye el modelo User para obtener información del seguidor
          as: "followerId", // Relación definida en tu modelo
          where: { is_online: "online" }, // Solo seguidores que están en línea
          attributes: ["id", "username", "profile_picture", "is_online"], // Atributos que queremos del usuario
        },
      ],
    });

    // Si no se encuentran seguidores en línea
    if (!onlineFollowers.length) {
      throw new Error("No se encontraron seguidores en línea para este usuario.");
    }

    // Retorna la lista de seguidores en línea con su información relevante
    return onlineFollowers.map(follower => ({
      follower_id: follower.followerId.id,
      username: follower.followerId.username,
      email: follower.followerId.email,
      profile_picture: follower.followerId.profile_picture,
      is_online: follower.followerId.is_online,
    }));

  } catch (error) {
    console.error("Error al obtener los seguidores en línea:", error);
    throw error;
  }
};