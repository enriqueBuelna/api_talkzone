import { Post } from "../models/post.models.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { getFollowing } from "./followers.services.js";
import { getUserPreferencesTag } from "./user_preferences_tag.services.js";
import { Topic } from "../models/topic.models.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { Tag } from "../models/tag.models.js";
import { getUserPreferences } from "./user_preferences.services.js";
import { PostTag } from "../models/post_tag.model.js";
import { createPostTagService } from "./post_tag.services.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getUserPreferencess } from "./users.services.js";
import { Like } from "../models/like.model.js";
import { json, Op } from "sequelize";
// Crear una nueva publicación
export const createPostService = async (
  user_id,
  content,
  media_url,
  visibility,
  user_preference_id,
  tags
) => {
  try {
    const newPost = await Post.create({
      user_id,
      content,
      media_url,
      visibility,
      user_preference_id,
    });

    const matchingPost = await Post.findOne({
      where: {
        id: newPost.id,
      },
      include: [
        {
          model: User,
          as: "post_user",
          attributes: ["id", "username", "gender", "profile_picture"],
        },
        {
          model: UserPreference,
          as: "post_user_preference",
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
          attributes: ["topic_id", "type"],
        },
        {
          model: Comment, // Incluir los comentarios asociados al post
          include: [
            {
              as: "userss",
              model: User, // Incluir la información del usuario que hizo cada comentario
              attributes: ["id", "username", "gender", "profile_picture"],
            },
          ],
          attributes: ["id", "content", "likes_count"],
        },
      ],
    });

    return matchingPost;
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    throw new Error("Error al crear la publicación");
  }
};

// Actualizar una publicación existente
export const updatePostService = async (
  id,
  { content, media_url, visibility, topic_id }
) => {
  try {
    // Buscar la publicación por ID
    const post = await Post.findByPk(id);

    if (!post) {
      throw new Error("Publicación no encontrada");
    }

    // Actualizar los campos de la publicación
    post.content = content !== undefined ? content : post.content;
    post.media_url = media_url !== undefined ? media_url : post.media_url;
    post.visibility = visibility !== undefined ? visibility : post.visibility;
    post.topic_id = topic_id !== undefined ? topic_id : post.topic_id;

    // Guardar los cambios
    await post.save();

    return post; // Retornar la publicación actualizada
  } catch (error) {
    console.error("Error al actualizar la publicación:", error);
    throw new Error("Error al actualizar la publicación");
  }
};

export const getPostByIdService = async (postId) => {
  try {
    // Buscar la publicación por su ID, incluyendo los comentarios y los usuarios de cada comentario
    // const post = await Post.findOne({
    //   where: { id: postId }, // Filtrar por ID de la publicación
    //   include: [
    //     {
    //       model: Comment, // Incluir los comentarios asociados al post
    //       include: [
    //         {
    //           association: "userss",
    //           model: User, // Incluir la información del usuario que hizo cada comentario
    //           attributes: ["username", "email"], // Traer solo los campos necesarios del usuario
    //         },
    //       ],
    //     },
    //   ],
    // });

    const matchingPost = await Post.findOne({
      where: {
        id: postId,
      },
      include: [
        {
          model: User,
          as: "post_user",
          attributes: ["id", "username", "gender", "profile_picture"],
        },
        {
          model: UserPreference,
          as: "post_user_preference",
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
          attributes: ["topic_id", "type"],
        },
        {
          model: Comment, // Incluir los comentarios asociados al post
          include: [
            {
              as: "userss",
              model: User, // Incluir la información del usuario que hizo cada comentario
              attributes: ["id", "username", "gender", "profile_picture"],
            },
          ],
          attributes: ["id", "content", "likes_count"],
        },
      ],
    });

    if (!matchingPost) {
      throw Error("No se encontro post");
    }

    return matchingPost;
  } catch (error) {
    console.log(error);
  }
};

// Eliminar una publicación
export const deletePostService = async (id) => {
  try {
    // Buscar la publicación por ID
    const post = await Post.findByPk(id);

    if (!post) {
      throw new Error("Publicación no encontrada");
    }

    // Eliminar la publicación
    await post.destroy();

    return { message: "Publicación eliminada exitosamente" };
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    throw new Error("Error al eliminar la publicación");
  }
};

export const getPostFollowingService = async (id, page = 1, limit = 10) => {
  try {
    // Obtener los IDs de los usuarios que sigues
    let following = await getFollowing(id);
    let ids = following.map((el) => el.id); // Extraer solo los IDs de los following

    // Calcular el offset
    const offset = (page - 1) * limit;

    // Obtener los posts de los usuarios que sigues con paginación
    const posts = await Post.findAll({
      where: {
        user_id: ids, // Filtrar por los IDs de los usuarios que sigues
        visibility: "public", // Puedes ajustar la visibilidad según tus requerimientos
      },
      order: [["created_at", "DESC"]], // Ordenar los posts por fecha de creación, de más reciente a más antiguo
      limit: limit, // Limitar el número de resultados
      offset: offset, // Desplazamiento para la paginación
    });

    // Contar el total de posts para calcular el número de páginas
    const totalPosts = await Post.count({
      where: {
        user_id: ids,
        visibility: "public",
      },
    });

    // Calcular el total de páginas
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
    }; // Retornar los posts y datos de paginación
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los posts de los following");
  }
};

export const getPostTopicsService = async (id, page = 1, limit = 10) => {
  try {
    // Obtener las preferencias del usuario (learn/know y topic_id)
    const preferences = await getUserPreferences(id);
    // Extraer los IDs de los topics
    const topicIds = preferences.map((pref) => pref.topic_id);

    // Extraer los user_preference_id
    const userPreferenceIds = preferences.map((pref) => pref.id);

    // Obtener los tags asociados a las user preferences
    const preferenceTagsData = await UserPreferenceTag.findAll({
      where: {
        user_preference_id: userPreferenceIds, // Filtrar por los user_preference_id
      },
      include: [Tag], // Incluir el modelo de tags para obtener los tag_id
    });

    // Extraer los tag_id de las preferencias del usuario
    const preferenceTags = preferenceTagsData.map((prefTag) => prefTag.Tag.id);

    // Calcular el offset
    const offset = (page - 1) * limit;

    // Obtener los posts filtrados por topic_id con paginación
    const posts = await Post.findAll({
      where: {
        topic_id: topicIds, // Filtrar por los topics que el usuario prefiere
        visibility: "public", // Ajusta la visibilidad según los requerimientos
      },
      order: [["created_at", "DESC"]], // Ordenar los posts por fecha de creación, de más reciente a más antiguo
      limit: limit, // Limitar el número de resultados
      offset: offset, // Desplazamiento para la paginación
    });

    // Obtener los IDs de los posts para buscar sus etiquetas
    const postIds = posts.map((post) => post.id);

    // Obtener las etiquetas de los posts desde PostTag
    const postTags = await PostTag.findAll({
      where: {
        post_id: postIds, // Filtrar por los posts obtenidos
      },
    });

    // Agrupar las etiquetas por post_id
    const tagsByPost = postTags.reduce((acc, postTag) => {
      if (!acc[postTag.post_id]) {
        acc[postTag.post_id] = [];
      }
      acc[postTag.post_id].push(postTag.tag_id);
      return acc;
    }, {});

    // Algoritmo para ponderar los posts según coincidencias de etiquetas
    const rankedPosts = posts.map((post) => {
      const postTags = tagsByPost[post.id] || []; // Obtener las etiquetas del post
      let score = 0;

      // Aumentar la puntuación si hay coincidencias de etiquetas
      postTags.forEach((tagId) => {
        if (preferenceTags.includes(tagId)) {
          score += 1; // Sumar 1 por cada coincidencia de etiqueta
        }
      });

      return { post, score }; // Devolver el post con su puntaje
    });

    // Ordenar los posts por score (más relevante primero) y luego por fecha
    rankedPosts.sort((a, b) => {
      if (b.score === a.score) {
        return new Date(b.post.created_at) - new Date(a.post.created_at); // Si el score es igual, ordenar por fecha
      }
      return b.score - a.score; // Mayor score primero
    });

    // Retornar solo los posts después de aplicar el orden
    return rankedPosts.map((p) => p.post);
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    throw new Error("Error al obtener las publicaciones");
  }
};

// export const getPostAll = async (user_id) => {
//   try {
//     const user_preferences = formatResponse(await getUserPreferencess(user_id));
//     //conseguir los ids de los topics
//     const topicIds = user_preferences.map((pref) => pref.id);
//     const matchingPost = await Post.findAll({
//       where: {
//         user_preference_id: {
//           [Op.in]: topicIds,
//         },
//       },
//       include: [
//         {
//           model: User,
//           as: "post_user",
//           attributes: ["id", "username", "gender", "profile_picture"],
//         },
//         {
//           model: UserPreference,
//           as: "post_user_preference",
//           include: [
//             {
//               model: Topic,
//               attributes: ["topic_name"],
//             },
//           ],
//           attributes: ["topic_id", "type"],
//         },
//       ],
//     });
//     return matchingPost;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getPostAll = async (user_id, page = 1, pageSize = 10) => {
  try {
    const user_preferences = formatResponse(await getUserPreferencess(user_id));
    const topicIds = user_preferences.map((pref) => pref.id);

    const offset = (page - 1) * pageSize;

    const matchingPost = await Post.findAll({
      where: {
        user_preference_id: {
          [Op.in]: topicIds,
        },
      },
      include: [
        {
          model: User,
          as: "post_user",
          attributes: ["id", "username", "gender", "profile_picture"],
        },
        {
          model: UserPreference,
          as: "post_user_preference",
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
          attributes: ["topic_id", "type"],
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    return matchingPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function formatResponse(data) {
  return data.map((item) => ({
    id: item.id,
    type: item.type, // Cambiado de type a role para reflejar el nuevo formato
    topic_id: item.topic_id,
    tags: item.userPreferenceTags.map((tag) => tag.tag_id),
  }));
}

//

export const getPostFriends = async (user_id) => {
  let usuarios = await getFollowing(user_id);
  let usuariosId = usuarios.map((el) => el.id);
  console.log(usuariosId);
  const matchingPost = await Post.findAll({
    where: {
      user_id: {
        [Op.in]: usuariosId,
      },
    },
    include: [
      {
        model: User,
        as: "post_user",
        attributes: ["id", "username", "gender", "profile_picture"],
      },
      {
        model: UserPreference,
        as: "post_user_preference",
        include: [
          {
            model: Topic,
            attributes: ["topic_name"],
          },
        ],
        attributes: ["topic_id", "type"],
      },
    ],
  });
  return matchingPost;
};

export const getYourPost = async (user_id, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;

    const matchingPost = await Post.findAll({
      where: {
        user_id,
      },
      include: [
        {
          model: User,
          as: "post_user",
          attributes: ["id", "username", "gender", "profile_picture"],
        },
        {
          model: UserPreference,
          as: "post_user_preference",
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
          attributes: ["topic_id", "type"],
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    return matchingPost;
  } catch (error) {}
};

export const getLikePost = async (user_id, page = 1, pageSize = 10) => {
  try {
    const likedPosts = await Like.findAll({
      attributes: ["post_id"], // Selecciona solo el campo post_id
      where: {
        user_id, // Filtra por el ID del usuario
        post_id: { [Op.ne]: null }, // Asegúrate de que sea un like asociado a un post, no a un comentario
      },
      raw: true, // Devuelve datos puros sin instancias de Sequelize
    });
    const postIds = likedPosts.map((like) => like.post_id);
    const offset = (page - 1) * pageSize;

    const matchingPost = await Post.findAll({
      where: {
        id: postIds,
      },
      include: [
        {
          model: User,
          as: "post_user",
          attributes: ["id", "username", "gender", "profile_picture"],
        },
        {
          model: UserPreference,
          as: "post_user_preference",
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
          attributes: ["topic_id", "type"],
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    return matchingPost;
  } catch (error) {}
};
