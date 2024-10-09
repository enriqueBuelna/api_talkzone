import * as userPreferenceService from '../services/user_preferences.services.js';

// Crear una nueva preferencia para el usuario
export const createUserPreference = async (req, res) => {
    const { user_id, topic_id, type } = req.body;

    try {
        const newPreference = await userPreferenceService.createUserPreference(user_id, topic_id, type);
        return res.status(201).json(newPreference);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || 'Error al crear la preferencia de usuario' });
    }
};

// Obtener todas las preferencias de un usuario
export const getUserPreferences = async (req, res) => {
    const { user_id } = req.params;

    try {
        const preferences = await userPreferenceService.getUserPreferences(user_id);
        return res.status(200).json(preferences);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || 'Error al obtener las preferencias de usuario' });
    }
};

// Actualizar una preferencia de usuario
export const updateUserPreference = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    try {
        const updatedPreference = await userPreferenceService.updateUserPreference(id, type);
        return res.status(200).json(updatedPreference);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || 'Error al actualizar la preferencia de usuario' });
    }
};

// Eliminar una preferencia de usuario
export const deleteUserPreference = async (req, res) => {
    const { id } = req.params;

    try {
        await userPreferenceService.deleteUserPreference(id);
        return res.status(200).json({ message: 'Preferencia eliminada correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || 'Error al eliminar la preferencia de usuario' });
    }
};
