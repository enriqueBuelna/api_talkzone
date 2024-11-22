import { Like } from "../models/like.model.js";
import { Post } from "../models/post.models.js";
import { Comment } from "../models/comment.model.js";
import { createNotification } from "../services/notification.services.js";
export const toggleLike = async (req, res) => {
  const { user_id, post_id, comment_id } = req.body;

  // Validar que solo se llene post_id o comment_id
  if (!((post_id && !comment_id) || (!post_id && comment_id))) {
    return res.status(400).json({
      message:
        "A Like must be associated with either a post or a comment, but not both.",
    });
  }

  try {
    // Determinar si es un like para un post o un comentario
    let which = post_id ? "post" : "comment";
    console.log(which);
    // Buscar si el like ya existe
    const existingLike = await Like.findOne({
      where: {
        user_id,
        ...(post_id ? { post_id } : { comment_id }),
      },
    });

    if (existingLike) {
      // Si ya existe, eliminar el like
      await existingLike.destroy();
      return res.status(200).json(false);
    } else {
      // Si no existe, crear el like
      let aux;
      if (which === "post") {
        aux = await Post.findByPk(post_id);
      } else {
        aux = await Comment.findByPk(comment_id);
      }

      const like = await Like.create({ user_id, post_id, comment_id });
      if (user_id !== aux.user_id) {
        await createNotification(
          user_id,
          aux.user_id,
          "like",
          null,
          null,
          null,
          like.id,
          null
        );
      }
      return res.status(201).json(true);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred.", error });
  }
};

// Eliminar un like
export const deleteLike = async (req, res) => {
  const { id } = req.params;

  try {
    const like = await Like.findByPk(id);
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();
    return res.status(204).send(); // No content
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting like", error: error.message });
  }
};
