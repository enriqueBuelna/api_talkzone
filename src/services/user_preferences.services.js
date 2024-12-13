import { User } from "../models/user.model.js";
import { Topic } from "../models/topic.models.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { createUserPreferenceTag } from "./user_preferences_tag.services.js";
import { Tag } from "../models/tag.models.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { where } from "sequelize";

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
    if (!existingPreference.is_active) {
      await existingPreference.update({
        type,
        is_active: true,
      });

      const tagPromises = tagss.map((el) =>
        createUserPreferenceTag(existingPreference.id, el.id)
      );
      const tag = await Promise.all(tagPromises);
      const valueReturn = {
        id: existingPreference.id,
        topic_name: topic.topic_name,
        topic_id,
        type: existingPreference.type,
        tags: tag,
      };
      return valueReturn;
    }
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
  try {
    const preferences = await UserPreference.findAll({
      where: { user_id, is_active: true },
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
      console.log("uwu")
      return []
    }

    return preferences;
  } catch (error) {
    console.log(error);
  }
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
  try {
    const preference = await UserPreference.findByPk(id);

    if (!preference) {
      throw new Error("Preferencia no encontrada");
    }

    await preference.update({
      is_active: false,
    });

    const tagsToDelete = await UserPreferenceTag.findAll({
      where: {
        user_preference_id: preference.id,
      },
    });

    // Filtrar los tags que realmente existen
    const tagIdsToDelete = tagsToDelete.map((record) => record.tag_id);

    // Eliminar los tags existentes
    if (tagIdsToDelete.length > 0) {
      await UserPreferenceTag.destroy({
        where: {
          user_preference_id: preference.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
