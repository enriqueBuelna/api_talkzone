import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.models.js";
import { createNotification } from "../services/notification.services.js";

// Función para crear un nuevo comentario
export const createComment = async (req, res) => {
  try {
    const { post_id, user_id, content, parent_comment_id } = req.body;

    // Validar que el post exista
    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Validar que el usuario exista (opcional)
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Crear el nuevo comentario
    const newComment = await Comment.create({
      post_id,
      user_id,
      content,
      parent_comment_id, // Este campo es opcional
    });

    await post.update({
      comments_count: post.comments_count + 1,
    });

    let comment = await Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          as: "userss",
          model: User, // Incluir la información del usuario que hizo cada comentario
          attributes: ["id", "username", "gender", "profile_picture"],
        },
      ],
      attributes: ["id", "content", "likes_count"],
    });

    if(post.user_id !== user_id){
      await createNotification(
        user_id,
        post.user_id,
        "comment",
        null,
        newComment.id,
        null,
        null,
        null
      );
    }

    return res.status(201).json({
      comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
