import { Router } from "express";
import {
  createUserPreferenceTag,
  getUserPreferenceTags,
  updateUserPreferenceTag,
  deleteUserPreferenceTag,
  createTags
} from "../controllers/user_preferences_tags.controllers.js"; // Asegúrate de que la ruta sea correcta

const router = Router();

// Crear un nuevo UserPreferenceTag
router.post("/preferencesTag", createUserPreferenceTag);

// Obtener todos los UserPreferenceTags
router.get("/preferencesTag", getUserPreferenceTags);

// Actualizar un UserPreferenceTag por ID
router.put("/preferencesTag/:id", updateUserPreferenceTag);

// Eliminar un UserPreferenceTag por ID
router.delete("/preferencesTag/:id", deleteUserPreferenceTag);

router.post("/preferencesTags/createTags", createTags);

export default router;
