import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { Tag } from "../models/tag.models.js";
import { User } from "../models/user.model.js";
export const getUserPreferencesTag = async (user_preference_id) => {
  const preferences = await UserPreferenceTag.findAll({
    where: { user_preference_id },
    include: [Tag], // Incluir el tema asociado
  });

  if (!preferences.length) {
    throw new Error("No se encontraron preferencias para este usuario");
  }

  return preferences;
};

export const createUserPreferenceTag = async (user_preference_id, tag_id) => {
  const user = await UserPreference.findByPk(user_preference_id);
  const tag = await Tag.findByPk(tag_id);
  console.log(user_preference_id, tag_id);
  const existingPreference = await UserPreferenceTag.findOne({
    where: {
      user_preference_id,
      tag_id,
    },
  });

  if (existingPreference) {
    throw new Error("La preferencia ya existe para este usuario y tema.");
  }

  if (!user || !tag) {
    throw new Error("Usuario o Tema no encontrado");
  }

  const newPreference = await UserPreferenceTag.create({
    user_preference_id,
    tag_id
  });
};