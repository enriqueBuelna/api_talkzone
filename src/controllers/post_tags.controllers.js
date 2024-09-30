import { Post } from "../models/post.models.js";
import { Tag } from "../models/tag.models.js";


// Crear una relación entre un post y un tag
export const createPostTag = async (req, res) => {
    const { post_id, tag_id } = req.body;

    try {
        // Verificar si el post y el tag existen
        const postExists = await Post.findByPk(post_id);
        const tagExists = await Tag.findByPk(tag_id);

        if (!postExists) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        if (!tagExists) {
            return res.status(404).json({ message: "Tag no encontrado" });
        }

        // Crear la relación
        const postTag = await PostTag.create({ post_id, tag_id });
        res.status(201).json(postTag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la relación", error });
    }
};

// Eliminar una relación entre un post y un tag
export const deletePostTag = async (req, res) => {
    const { post_id, tag_id } = req.params;

    try {
        // Eliminar la relación
        const result = await PostTag.destroy({
            where: { post_id, tag_id }
        });

        if (result === 0) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        res.status(204).json(); // Sin contenido
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la relación", error });
    }
};