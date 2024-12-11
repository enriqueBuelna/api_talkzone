import { Community } from "../models/communitie.model.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.model.js";
import { VoiceRoom } from "../models/voice_rooms.models.js";
import { Follower } from "../models/follower.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { getUserPreferencess } from "../services/users.services.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { Topic } from "../models/topic.models.js";
import { UserHostRanking } from "../models/user_host_ranking.model.js";
import { Op } from "sequelize";
import { Message } from "../models/message.models.js";
import { ModerationReport } from "../models/moderation_report.model.js";
import { createMessage } from "../services/messages.services.js";
export const sendWarning = async (req, res) => {
  let {message, reported_user_id, id} = req.body;
  try {
    console.log(id);
    await createMessage('dbb9d930-e338-40c2-9162-d7a04ab6851a', reported_user_id, message);
    let report = await ModerationReport.findByPk(id);
    await report.update({
      result: "Advertencia enviada",
      status: "resolved",
    });
    return res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
}


export const verifyUser = async (req, res) => {
  let { user_id } = req.body;
  console.log(user_id);
  try {
    let user = await User.findByPk(user_id);
    await user.update({
      is_verified: true,
    });
    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const unverifyUser = async (req, res) => {
  let { user_id } = req.body;
  try {
    let user = await User.findByPk(user_id);
    await user.update({
      is_verified: false,
    });
    res.status(201).json(true);
  } catch (error) {}
};

export const getDetailUser = async (req, res) => {
  let { user_id } = req.query;
  try {
    if (user_id.length !== 36) {
      res.status(404).json("No encontrado");
    }
    let username = await User.findOne({
      where: {
        id: user_id,
      },
    });
    let cant_posts = await Post.count({
      where: {
        user_id,
      },
    });
    let cant_followers = await Follower.count({
      where: {
        followed_id: user_id,
      },
    });
    let cant_followed = await Follower.count({
      where: {
        follower_id: user_id,
      },
    });
    let cant_vr = await VoiceRoom.count({
      where: {
        host_user_id: user_id,
      },
    });
    let cant_comm = await Comment.count({
      where: {
        user_id,
      },
    });

    // Likes recibidos en publicaciones
    const postLikes = await Like.count({
      include: {
        model: Post,
        as: "liked_post",
        where: { user_id },
      },
    });

    // Likes recibidos en comentarios
    const commentLikes = await Like.count({
      include: {
        model: Comment,
        where: { user_id },
      },
    });

    let cant_likes_received = postLikes + commentLikes;

    const cant_likes_gived = await Like.count({
      where: {
        user_id,
      },
    });

    const themes = await getUserPreferencess(user_id);

    const response = {
      cant_posts,
      cant_comm,
      cant_followed,
      cant_followers,
      cant_vr,
      cant_likes_gived,
      cant_likes_received,
      themes,
      username: username.username,
      is_verified: username.is_verified,
    };
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const deleteContent = async (req, res) => {
  const { type, report_id } = req.body;

  try {
    let report = await ModerationReport.findByPk(report_id);
    // if(type === 'message'){
    //   let message = await Message.findByPk(content_id);
    //   await message.destroy();
    // }else if(type === 'post'){
    //   let post = await Post.findByPk(content_id);
    //   await post.destroy();
    // }

    if (report.message_id) {
      let message = await Message.findByPk(report.message_id);
      await message.destroy();
    } else if (report.post_id) {
      let post = await Post.findByPk(report.post_id);
      await post.destroy();
    }

    await report.update({
      result: "Contenido borrado",
      status: "resolved",
    });
    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const getMostFollowed = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        user_role: "user",
      },
      attributes: [
        "id",
        "username",
        "email",
        "is_active",
        "last_login",
        "follower_count",
      ],
      order: [["follower_count", "DESC"]], // Ordenar por follower_count de mayor a menor
      limit: 10, // Obtener solo los primeros 10
    });
    res.status(201).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getPrincipalStats = async (req, res) => {
  try {
    const posts = await Post.count();
    const users = await User.count();
    const voice_room = await VoiceRoom.count();
    const groups = await Community.count();

    let response = {
      cant_post: posts,
      cant_users: users,
      cant_vr: voice_room,
      cant_groups: groups,
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        user_role: "user",
      },
      attributes: ["id", "username", "email", "is_active", "last_login"],
    });
    res.status(201).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getStatsCurious = async (req, res) => {
  try {
    //post
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recordsLast7DaysPost = await Post.count({
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo, // Mayor o igual que hace 7 días
        },
      },
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recordsLastMonthPost = await Post.count({
      where: {
        created_at: {
          [Op.gte]: oneMonthAgo, // Mayor o igual que hace 1 mes
        },
      },
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recordsLast6MonthsPost = await Post.count({
      where: {
        created_at: {
          [Op.gte]: sixMonthsAgo, // Mayor o igual que hace 6 meses
        },
      },
    });

    //users
    const recordsLast7DaysUser = await User.count({
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo, // Mayor o igual que hace 7 días
        },
      },
    });
    const recordsLastMonthUser = await User.count({
      where: {
        created_at: {
          [Op.gte]: oneMonthAgo, // Mayor o igual que hace 1 mes
        },
      },
    });
    const recordsLast6MonthsUser = await User.count({
      where: {
        created_at: {
          [Op.gte]: sixMonthsAgo, // Mayor o igual que hace 6 meses
        },
      },
    });

    //voice_rooms
    const recordsLast7DaysRoom = await VoiceRoom.count({
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo, // Mayor o igual que hace 7 días
        },
      },
    });
    const recordsLastMonthRoom = await VoiceRoom.count({
      where: {
        created_at: {
          [Op.gte]: oneMonthAgo, // Mayor o igual que hace 1 mes
        },
      },
    });
    const recordsLast6MonthsRoom = await VoiceRoom.count({
      where: {
        created_at: {
          [Op.gte]: sixMonthsAgo, // Mayor o igual que hace 6 meses
        },
      },
    });

    //all
    const allPost = await Post.count();
    const allRoom = await VoiceRoom.count();
    const allUsers = await User.count();

    let response = {
      sevenPost: recordsLast7DaysPost,
      monthPost: recordsLastMonthPost,
      sixMonthPost: recordsLast6MonthsPost,
      sevenUser: recordsLast7DaysUser,
      monthUser: recordsLastMonthUser,
      sixMonthUser: recordsLast6MonthsUser,
      sevenRoom: recordsLast7DaysRoom,
      monthRoom: recordsLastMonthRoom,
      sixMonthRoom: recordsLast6MonthsRoom,
      allPost,
      allRoom,
      allUsers,
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getTopTopics = async (req, res) => {
  try {
    // Obtener las publicaciones con las preferencias y temas relacionados
    const posts = await Post.findAll({
      include: [
        {
          as: "post_user_preference",
          model: UserPreference,
          include: [
            {
              model: Topic,
              attributes: ["id", "topic_name"],
            },
          ],
          attributes: ["id", "type"],
        },
      ],
      attributes: ["id"],
    });

    // Transformar los resultados para agrupar por topic_id y contar
    const topicCounts = posts.reduce((acc, post) => {
      const topic = post.post_user_preference?.topic;
      if (topic) {
        const { id: topicId, topic_name: topicName } = topic;
        acc[topicId] = acc[topicId] || { topicId, topicName, count: 0 };
        acc[topicId].count += 1;
      }
      return acc;
    }, {});

    // Convertir el objeto a un arreglo y ordenar por la cantidad de publicaciones
    const sortedTopics = Object.values(topicCounts).sort(
      (a, b) => b.count - a.count
    );

    // Obtener solo los 5 más usados
    const top5Topics = sortedTopics.slice(0, 5);

    // Responder con el resultado
    return res.status(200).json(top5Topics);
  } catch (error) {
    console.error("Error fetching top topics:", error);
    return res.status(500).json({ message: "Error fetching top topics" });
  }
};

export const getTopTags = async (req, res) => {
  
}
 
export const getTopTopicsRoom = async (req, res) => {
  try {
    const topicsRoom = await VoiceRoom.findAll({
      include: [
        {
          model: Topic,
          attributes: ["id", "topic_name"],
        },
      ],
      attributes: ["id"],
    });
    // Agrupar por topic_id y contar las ocurrencias
    const topicCounts = topicsRoom.reduce((acc, room) => {
      const topic = room.topic; // Acceder al tema relacionado
      console.log(topic);
      if (topic) {
        const { id: topicId, topic_name: topicName } = topic;
        acc[topicId] = acc[topicId] || { topicId, topicName, count: 0 };
        acc[topicId].count += 1;
      }
      return acc;
    }, {});

    // Convertir el objeto a un arreglo y ordenar por cantidad de ocurrencias
    const sortedTopics = Object.values(topicCounts).sort(
      (a, b) => b.count - a.count
    );

    // Obtener solo los 5 más usados
    const top5Topics = sortedTopics.slice(0, 5);

    // Responder con el resultado
    return res.status(200).json(top5Topics);
  } catch (error) {
    console.log(error);
  }
};

export const getTopHosts = async (req, res) => {
  try {
    // Consultar la tabla UserHostRanking y unirla con la información del usuario
    const topHosts = await UserHostRanking.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "profile_picture", "gender", "is_verified"], // Ajusta los atributos según tu modelo de User
        },
      ],
      attributes: ["average_rating", "total_ratings"],
      order: [
        ["average_rating", "DESC"],
        ["total_ratings", "DESC"],
      ], // Ordenar por promedio y luego por total de ratings
      limit: 5, // Limitar a los 5 mejores
    });

    // Responder con los datos del ranking
    return res.status(200).json(topHosts);
  } catch (error) {
    console.error("Error fetching top hosts:", error);
    return res.status(500).json({ message: "Error fetching top hosts" });
  }
};
