import { Router } from 'express';
import {
    createUserPreference,
    getUserPreferences,
    updateUserPreference,
    deleteUserPreference,
    filteredPreference
} from '../controllers/user_preferences.controllers.js';

const router = Router();

// Ruta para crear una nueva preferencia de usuario
router.post('/preferences', createUserPreference);

// Ruta para obtener todas las preferencias de un usuario
router.get('/preferences', getUserPreferences);

// Ruta para actualizar una preferencia de usuario
router.put('/preferences/:id', updateUserPreference);

// Ruta para eliminar una preferencia de usuario
router.delete('/preferences/:id', deleteUserPreference);

router.post('/preferences/filtered', filteredPreference);

export default router;