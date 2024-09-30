import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { Tag } from "../models/tag.models.js";

// Crear un nuevo UserPreferenceTag
export const createUserPreferenceTag = async (req, res) => {
  const { user_preference_id, tag_id } = req.body;
  try {
    const userPreferenceTag = await UserPreferenceTag.create({
      user_preference_id,
      tag_id,
    });
    res.status(201).json(userPreferenceTag);
  } catch (error) {
    console.error("Error al crear el UserPreferenceTag:", error);
    res.status(500).json({ message: "Error al crear el UserPreferenceTag" });
  }
};

// Obtener todos los UserPreferenceTags
export const getUserPreferenceTags = async (req, res) => {
  try {
    const userPreferenceTags = await UserPreferenceTag.findAll({
      include: [
        {
          model: UserPreference,
          attributes: ["id", "type"], // Incluye los atributos que deseas mostrar
        },
        {
          model: Tag,
          attributes: ["id", "tag_name"], // Incluye los atributos que deseas mostrar
        },
      ],
    });
    res.status(200).json(userPreferenceTags);
  } catch (error) {
    console.error("Error al obtener los UserPreferenceTags:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los UserPreferenceTags" });
  }
};

// Actualizar un UserPreferenceTag
export const updateUserPreferenceTag = async (req, res) => {
  const { id } = req.params;
  const { user_preference_id, tag_id } = req.body;

  try {
    const [updated] = await UserPreferenceTag.update(
      { user_preference_id, tag_id },
      { where: { id } }
    );

    if (updated) {
      const updatedUserPreferenceTag = await UserPreferenceTag.findByPk(id);
      res.status(200).json(updatedUserPreferenceTag);
    } else {
      res.status(404).json({ message: "UserPreferenceTag no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el UserPreferenceTag:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el UserPreferenceTag" });
  }
};

// Eliminar un UserPreferenceTag
export const deleteUserPreferenceTag = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await UserPreferenceTag.destroy({ where: { id } });

    if (deleted) {
      res.status(204).json(); // Sin contenido
    } else {
      res.status(404).json({ message: "UserPreferenceTag no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el UserPreferenceTag:", error);
    res.status(500).json({ message: "Error al eliminar el UserPreferenceTag" });
  }
};
