import { Router } from 'express';
import {
    createUserPreference,
    getUserPreferences,
    updateUserPreference,
    deleteUserPreference
} from '../controllers/user_preferences.controllers.js';

const router = Router();

// Ruta para crear una nueva preferencia de usuario
router.post('/preferences', createUserPreference);

// Ruta para obtener todas las preferencias de un usuario
router.get('/preferences/:user_id', getUserPreferences);

// Ruta para actualizar una preferencia de usuario
router.put('/preferences/:id', updateUserPreference);

// Ruta para eliminar una preferencia de usuario
router.delete('/preferences/:id', deleteUserPreference);

export default router;