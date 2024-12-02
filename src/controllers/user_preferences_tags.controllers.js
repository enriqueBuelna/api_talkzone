import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { Tag } from "../models/tag.models.js";

export const createTags = async (req, res) => {
  const { user_preference_id, tag, tagsEliminated } = req.body;

  try {
    // Mapear los ids desde el arreglo de tags
    const tagsId = tag.map((el) => el.id);

    // Obtener los registros existentes para este user_preference_id y tagsId
    const existingTags = await UserPreferenceTag.findAll({
      where: {
        user_preference_id,
        tag_id: tagsId,
      },
    });

    // Filtrar los ids que ya existen
    const existingTagIds = existingTags.map((record) => record.tag_id);
    const newTagIds = tagsId.filter((tagId) => !existingTagIds.includes(tagId));

    // Crear el arreglo para la inserción masiva
    const userPreferenceTags = newTagIds.map((tagId) => ({
      user_preference_id,
      tag_id: tagId,
    }));

    // Insertar solo los registros nuevos
    if (userPreferenceTags.length > 0) {
      await UserPreferenceTag.bulkCreate(userPreferenceTags);
    }

    // Manejar la eliminación de tags
    if (tagsEliminated && tagsEliminated.length > 0) {
      // Verificar si los tags a eliminar existen
      const tagsToDelete = await UserPreferenceTag.findAll({
        where: {
          user_preference_id,
          tag_id: tagsEliminated,
        },
      });

      // Filtrar los tags que realmente existen
      const tagIdsToDelete = tagsToDelete.map((record) => record.tag_id);

      // Eliminar los tags existentes
      if (tagIdsToDelete.length > 0) {
        await UserPreferenceTag.destroy({
          where: {
            user_preference_id,
            tag_id: tagIdsToDelete,
          },
        });
      }
    }

    // Responder al cliente con éxito
    res.status(201).json({ message: "Operación completada exitosamente" });
  } catch (error) {
    console.error(error);
    // Responder con un error
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};


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
