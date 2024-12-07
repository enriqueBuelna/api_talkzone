import { Community } from "../models/communitie.model.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.model.js";
import { VoiceRoom } from "../models/voice_rooms.models.js";
import { Follower } from "../models/follower.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { getUserPreferencess } from "../services/users.services.js";
export const getDetailUser = async (req, res) => {
  let { user_id } = req.query;
  try {
    if(user_id.length !== 36){
      res.status(404).json("No encontrado")
    }
    let username = await User.findOne({
      where: {
        id: user_id,
      }
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
      username: username.username
    };
    res.status(201).json(response);
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
