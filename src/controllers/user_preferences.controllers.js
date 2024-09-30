import { User } from "../models/usuario.model.js";
import { Topic } from "../models/topic.models.js";
import { UserPreference } from "../models/user_preferences.model.js";

// Crear una nueva preferencia para el usuario
export const createUserPreference = async (req, res) => {
    const { user_id, topic_id, type } = req.body;

    try {
        const user = await User.findByPk(user_id);
        const topic = await Topic.findByPk(topic_id);

        if (!user || !topic) {
            return res.status(404).json({ message: 'Usuario o Tema no encontrado' });
        }

        const newPreference = await UserPreference.create({
            user_id,
            topic_id,
            type,
        });

        return res.status(201).json(newPreference);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la preferencia de usuario' });
    }
};

// Obtener todas las preferencias de un usuario
export const getUserPreferences = async (req, res) => {
    const { user_id } = req.params;

    try {
        const preferences = await UserPreference.findAll({
            where: { user_id },
            include: [Topic],  // Incluir el tema asociado
        });

        if (!preferences.length) {
            return res.status(404).json({ message: 'No se encontraron preferencias para este usuario' });
        }

        return res.status(200).json(preferences);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las preferencias de usuario' });
    }
};

// Actualizar una preferencia de usuario
export const updateUserPreference = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    try {
        const preference = await UserPreference.findByPk(id);

        if (!preference) {
            return res.status(404).json({ message: 'Preferencia no encontrada' });
        }

        preference.type = type;
        await preference.save();

        return res.status(200).json(preference);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la preferencia de usuario' });
    }
};

// Eliminar una preferencia de usuario
export const deleteUserPreference = async (req, res) => {
    const { id } = req.params;

    try {
        const preference = await UserPreference.findByPk(id);

        if (!preference) {
            return res.status(404).json({ message: 'Preferencia no encontrada' });
        }

        await preference.destroy();

        return res.status(200).json({ message: 'Preferencia eliminada correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la preferencia de usuario' });
    }
};