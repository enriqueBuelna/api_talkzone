import * as userPreferenceService from "../services/user_preferences.services.js";
import {
  auxiliarMatchmaking,
  matchmakingConnect,
} from "./mm_user_connect.controllers.js";

// Crear una nueva preferencia para el usuario
export const createUserPreference = async (req, res) => {
  const { user_id, topic_id, type, tags } = req.body;

  try {
    const newPreference = await userPreferenceService.createUserPreference(
      user_id,
      topic_id,
      type,
      tags
    );
    return res.status(201).json(newPreference);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Error al crear la preferencia de usuario",
    });
  }
};

// Obtener todas las preferencias de un usuario
export const getUserPreferences = async (req, res) => {
  const { user_id } = req.query;

  try {
    const preferences = await userPreferenceService.getUserPreferences(user_id);
    return res.status(200).json(preferences);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Error al obtener las preferencias de usuario",
    });
  }
};

// Actualizar una preferencia de usuario
export const updateUserPreference = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const updatedPreference = await userPreferenceService.updateUserPreference(
      id,
      type
    );
    return res.status(200).json(updatedPreference);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Error al actualizar la preferencia de usuario",
    });
  }
};

// Eliminar una preferencia de usuario
export const deleteUserPreference = async (req, res) => {
  const { id } = req.query;

  try {
    await userPreferenceService.deleteUserPreference(id);
    return res
      .status(200)
      .json({ message: "Preferencia eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Error al eliminar la preferencia de usuario",
    });
  }
};

export const filteredPreference = async (req, res) => {
  const {
    user_id,
    topicsMentores,
    topicsEntusiastas,
    topicsExploradores,
    gender,
    connect,
    onlyMentores,
    onlyExploradores,
    onlyEntusiastas,
  } = req.body;
  try {
    let topicsIdMentores,
      topicsIdEntusiastas,
      topicsIdExploradores,
      genderOption,
      connectOption,
      onlyMentoresOption,
      onlyEntusiastasOption,
      onlyExploradoresOption;
    // let topicsIdKnow, topicsIdLearn, genderOption, connectOption;
    if (topicsMentores) {
      topicsIdMentores = topicsMentores.map((topic) => topic.topic_id);
    }
    if (topicsEntusiastas) {
      topicsIdEntusiastas = topicsEntusiastas.map((topic) => topic.topic_id);
    }
    if (topicsExploradores) {
      topicsIdExploradores = topicsExploradores.map((topic) => topic.topic_id);
    }
    // if (topicsLearn) {
    //   topicsIdLearn = topicsLearn.map((topic) => topic.topic_id);
    // }
    if (gender) {
      genderOption = gender.type;
    }
    if (connect) {
      connectOption = connect[0];
    }

    if (onlyMentores) {
      onlyMentoresOption = onlyMentores[0];
    }
    if (onlyEntusiastas) {
      onlyEntusiastasOption = onlyEntusiastas[0];
    }
    if (onlyExploradores) {
      onlyExploradoresOption = onlyExploradores[0];
    }
    //ocupo llamar a la prueba
    let usuarios = await auxiliarMatchmaking(user_id);
    let usuariosFiltered = [];
    // //si tiene topicsLearn ocupo ver que pedo
    // console.log(topicsIdMentores);
    usuarios.forEach((el) => {
      //el -> es un usuario
      let tuvoTodo = true;
      //en cada ele va a existir un topic_id
      if (genderOption) {
        if (genderOption !== el.userInformation.gender) {
          return false;
        }
      }
      if (connectOption) {
        if (el.userInformation.is_online !== "online") {
          return false;
        }
      }
      if (topicsMentores) {
        let arr2;
        if (onlyMentoresOption) {
          arr2 = el.userPreferences
            .filter((topic) => topic.type === "explorador")
            .map((topic) => topic.topic_id);
        } else {
          arr2 = el.userPreferences.map((topic) => topic.topic_id);
        }
        tuvoTodo = isSubset(topicsIdMentores, arr2);
        if (!tuvoTodo) {
          return false;
        }
      }
      if (topicsEntusiastas) {
        let arr2;
        if (onlyEntusiastasOption) {
          arr2 = el.userPreferences
            .filter((topic) => topic.type === "entusiasta")
            .map((topic) => topic.topic_id);
        } else {
          arr2 = el.userPreferences.map((topic) => topic.topic_id);
        }
        tuvoTodo = isSubset(topicsIdEntusiastas, arr2);
        if (!tuvoTodo) {
          return false;
        }
      }
      if (topicsExploradores) {
        let arr2;
        if (onlyExploradoresOption) {
          arr2 = el.userPreferences
            .filter((topic) => topic.type === "mentor")
            .map((topic) => topic.topic_id);
        } else {
          arr2 = el.userPreferences.map((topic) => topic.topic_id);
        }
        tuvoTodo = isSubset(topicsIdExploradores, arr2);
        if (!tuvoTodo) {
          return false;
        }
      }
      usuariosFiltered.push(el);
    });
    // console.log(usuariosFiltered);
    res.status(201).json(usuariosFiltered);
  } catch (error) {
    console.log(error);
  }
};

function isSubset(arr1, arr2) {
  const set2 = new Set(arr2); // Convierte arr2 en un Set para búsqueda eficiente
  return arr1.every((elem) => set2.has(elem)); // Verifica si cada elemento de arr1 está en set2
}
