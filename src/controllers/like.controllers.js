import { Like } from "../models/like.model.js";

export const createLike = async (req, res) => {
    const { user_id, post_id, comment_id } = req.body;

    // Validar que solo se llene post_id o comment_id
    if (!((post_id && !comment_id) || (!post_id && comment_id))) {
        return res.status(400).json({ message: 'A Like must be associated with either a post or a comment, but not both.' });
    }

    try {
        const like = await Like.create({ user_id, post_id, comment_id });
        return res.status(201).json(like);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating like', error: error.message });
    }
};

// Eliminar un like
export const deleteLike = async (req, res) => {
    const { id } = req.params;

    try {
        const like = await Like.findByPk(id);
        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        await like.destroy();
        return res.status(204).send(); // No content
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting like', error: error.message });
    }
};
