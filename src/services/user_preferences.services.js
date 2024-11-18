import { User } from "../models/user.model.js";
import { Topic } from "../models/topic.models.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { createUserPreferenceTag } from "./user_preferences_tag.services.js";
import { Tag } from "../models/tag.models.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";

// Servicio para crear una preferencia de usuario
export const createUserPreference = async (user_id, topic_id, type, tagss) => {
  const user = await User.findByPk(user_id);
  const topic = await Topic.findByPk(topic_id);

  const existingPreference = await UserPreference.findOne({
    where: {
      user_id,
      topic_id,
    },
  });

  if (existingPreference) {
    throw new Error("La preferencia ya existe para este usuario y tema.");
  }

  if (!user || !topic) {
    throw new Error("Usuario o Tema no encontrado");
  }

  const newPreference = await UserPreference.create({
    user_id,
    topic_id,
    type,
  });

  const tagPromises = tagss.map((el) =>
    createUserPreferenceTag(newPreference.id, el.id)
  );
  const tag = await Promise.all(tagPromises);
  const valueReturn = {
    id: newPreference.id,
    topic_name: topic.topic_name,
    topic_id,
    type: newPreference.type,
    tags: tag,
  };
  return valueReturn;
};

// Servicio para obtener las preferencias de un usuario
export const getUserPreferences = async (user_id) => {
  const preferences = await UserPreference.findAll({
    where: { user_id },
    include: [
      {
        model: Topic,
        attributes: ["id", "topic_name"],
      },
      {
        model: UserPreferenceTag,
        include: [
          {
            model: Tag,
            attributes: ["tag_name"],
          },
        ],
        attributes: ["id"],
      },
    ], // Incluir el tema asociado
    attributes: ["id", "type"],
  });

  if (!preferences.length) {
    throw new Error("No se encontraron preferencias para este usuario");
  }

  return preferences;
};

// Servicio para actualizar una preferencia de usuario
export const updateUserPreference = async (id, type) => {
  const preference = await UserPreference.findByPk(id);

  if (!preference) {
    throw new Error("Preferencia no encontrada");
  }

  preference.type = type;
  await preference.save();

  return preference;
};

// Servicio para eliminar una preferencia de usuario
export const deleteUserPreference = async (id) => {
  const preference = await UserPreference.findByPk(id);

  if (!preference) {
    throw new Error("Preferencia no encontrada");
  }

  await preference.destroy();
};
