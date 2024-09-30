import { Post } from "../models/post.models.js";

export const createPost = async (req, res) => {
  try {
    const { user_id, content, media_url, visibility, topic_id } = req.body;

    const newPost = await Post.create({
      user_id,
      content,
      media_url,
      visibility,
      topic_id,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear la publicación" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params; // ID del post que se quiere actualizar
    const { content, media_url, visibility, topic_id } = req.body;

    // Buscar la publicación por ID
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Actualizar los campos de la publicación
    post.content = content !== undefined ? content : post.content;
    post.media_url = media_url !== undefined ? media_url : post.media_url;
    post.visibility = visibility !== undefined ? visibility : post.visibility;
    post.topic_id = topic_id !== undefined ? topic_id : post.topic_id;

    // Guardar los cambios
    await post.save();

    return res.status(200).json(post); // Devolver la publicación actualizada
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la publicación" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params; // ID del post que se quiere eliminar

    // Buscar la publicación por ID
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Eliminar la publicación
    await post.destroy();

    return res.status(200).json({ message: "Publicación eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar la publicación" });
  }
};

// export const getPost = async (req, res) => {
//   try {
//     const { id } = req.params; // ID del post que se quiere obtener

//     // Buscar la publicación por ID junto con sus asociaciones (ej. usuario, comentarios)
//     const post = await Post.findByPk(id, {
//       include: [
//         {
//           model: User,  // Asumiendo que tienes una relación definida con el modelo User
//           attributes: ['username', 'profile_picture'] // Datos que quieres incluir del usuario
//         },
//         {
//           model: Comment, // Si tienes una relación con el modelo Comment
//           attributes: ['content', 'created_at'], // Datos de los comentarios
//           include: [{ model: User, attributes: ['username'] }] // Autor de cada comentario
//         }
//       ]
//     });

//     if (!post) {
//       return res.status(404).json({ message: "Publicación no encontrada" });
//     }

//     return res.status(200).json(post);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error al obtener la publicación" });
//   }
// };

