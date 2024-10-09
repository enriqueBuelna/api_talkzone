import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.models.js";

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

    return res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
