import { UserPreference } from "../models/user_preferences.model.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { Topic } from "../models/topic.models.js";
import {
  getUserPreferencess,
  getUserProileInformation,
} from "../services/users.services.js";
import { json, Op } from "sequelize";
import { Follower } from "../models/follower.model.js";

//USAR ESTE ENDPOINT
export const matchmakingConnect = async (req, res) => {
  let { user_id } = req.query;
  try {
    res.status(200).json(await auxiliarMatchmaking(user_id));
  } catch (error) {}
};

export const auxiliarMatchmaking = async (user_id) => {
  try {
    let usuarios = await calculateCompatibility(user_id);

    //arreglo

    let usuariosConPreferencias = await Promise.all(
      usuarios.map(async (el) => {
        // Obtener las preferencias del usuario y añadirlas al objeto
        const userPreferences = await getUserPreferencess(el.user_id);
        const userInformation = await getUserProileInformation(el.user_id);
        return {
          ...el,
          userPreferences, // Añadir el atributo userPreferences con el resultado de la función
          userInformation,
        };
      })
    );

    return usuariosConPreferencias;
  } catch (error) {}
};

// const calculateCompatibility = async (user_id) => {
//   try {
//     let user = formatResponse(await getUserPreferencess(user_id));
//     const topicIds = user.map((pref) => pref.topic_id);
//     const matchingUsers = await UserPreference.findAll({
//       attributes: ["user_id"],
//       where: {
//         topic_id: {
//           [Op.in]: topicIds,
//         },
//         user_id: {
//           [Op.ne]: user_id,
//         },
//       },
//       group: ["user_id"],
//       raw: true,
//     });

//     let matchingUser = await Promise.all(
//       matchingUsers.map(async (el) => {
//         const userPreferences = formatResponse(
//           await getUserPreferencess(el.user_id)
//         );
//         return {
//           ...el,
//           userPreferences, // Incluimos las preferencias del usuario aquí
//         };
//       })
//     );

//     let matches = [];
//     const userPrefByTopic = new Map();
//     user.forEach((pref) => {
//       userPrefByTopic.set(pref.topic_id, pref);
//     });

//     matchingUser.forEach(async (el) => {
//       let howMuchTopics = 0;
//       let howMuchTopicsCondition = 0;
//       let howManyTags = 0;

//       const otherUserPrefByTopic = new Map();
//       el.userPreferences.forEach((pref) => {
//         otherUserPrefByTopic.set(pref.topic_id, pref);
//       });

//       userPrefByTopic.forEach((userPref, topicId) => {
//         const otherPref = otherUserPrefByTopic.get(topicId);

//         if (!otherPref) {
//           // Penaliza si el otro usuario no tiene este tema
//           howMuchTopics -= 1;
//           return;
//         }

//         if (
//           (userPref.type === "know" && otherPref.type === "learn") ||
//           (userPref.type === "learn" && otherPref.type === "know")
//         ) {
//           howMuchTopicsCondition++;
//         } else {
//           howMuchTopics++;
//         }

//         // Comparar tags
//         if (userPref.tags.length > 0 && otherPref.tags.length > 0) {
//           const commonTagsCount = userPref.tags.filter((tag) =>
//             otherPref.tags.includes(tag)
//           ).length;
//           howManyTags += commonTagsCount; // Sumar coincidencias de tags
//         }
//       });

//       // Calcular el puntaje total
//       const userTotalTags = Array.from(userPrefByTopic.values()).reduce(
//         (sum, pref) => sum + pref.tags.length,
//         0
//       );

//       // Calcular el porcentaje de coincidencia de tags
//       let tagMatchPercentage = 0;
//       if (userTotalTags > 0) {
//         const uniqueUserTags = new Set();
//         userPrefByTopic.forEach((pref) => {
//           pref.tags.forEach((tag) => uniqueUserTags.add(tag));
//         });

//         const nonMatchingTagsCount = [...uniqueUserTags].filter(
//           (tag) =>
//             ![...otherUserPrefByTopic.values()].some((pref) =>
//               pref.tags.includes(tag)
//             )
//         ).length;

//         const totalUserTags = uniqueUserTags.size;
//         const totalCommonTags = howManyTags;

//         if (nonMatchingTagsCount === 0) {
//           tagMatchPercentage = (totalCommonTags / totalUserTags) * 100;
//         } else {
//           tagMatchPercentage =
//             (totalCommonTags / totalUserTags) *
//             100 *
//             (1 - nonMatchingTagsCount / totalUserTags);
//         }
//       }

//       const totalScore =
//         howMuchTopics * 5 + howMuchTopicsCondition * 10 + tagMatchPercentage;
//       const matchPercentage = Math.min((totalScore / 100) * 100, 100);
//       // Incluir las preferencias del usuario junto con el porcentaje de coincidencia
//       matches.push({
//         user_id: el.user_id,
//         matchPercentage,
//       });
//     });

//     // Ordenar por porcentaje de coincidencia
//     matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

//     // Devolver el array de coincidencias con preferencias y porcentaje
//     return matches;
//   } catch (error) {
//     console.error(error);
//   }
// };

// function formatResponse(data) {
//   return data.map((item) => ({
//     id: item.id,
//     type: item.type,
//     topic_id: item.topic_id,
//     tags: item.userPreferenceTags.map((tag) => tag.tag_id),
//   }));
// }

const calculateCompatibility = async (user_id) => {
  try {
    let user = formatResponse(await getUserPreferencess(user_id));
    //ocupo conseguir a las personas que sigo, para que no me salgan otra vez
    const followed = await Follower.findAll({
      where: { follower_id: user_id },
      attributes: ["followed_id"],
    });
    const followedId = followed.map((el) => el.followed_id);
    const topicIds = user.map((pref) => pref.topic_id);
    console.log(followedId);
    const matchingUsers = await UserPreference.findAll({
      attributes: ["user_id"],
      where: {
        topic_id: {
          [Op.in]: topicIds, // Incluye los IDs de temas en topicIds
        },
        [Op.and]: [
          { user_id: { [Op.ne]: user_id } }, // Diferente al usuario actual
          { user_id: { [Op.notIn]: followedId } }, // No esté en el arreglo de seguidos
        ],
      },

      group: ["user_id"],
      raw: true,
    });

    let matchingUser = await Promise.all(
      matchingUsers.map(async (el) => {
        const userPreferences = formatResponse(
          await getUserPreferencess(el.user_id)
        );
        return {
          ...el,
          userPreferences,
        };
      })
    );

    let matches = [];
    const userPrefByTopic = new Map();
    user.forEach((pref) => {
      userPrefByTopic.set(pref.topic_id, pref);
    });

    matchingUser.forEach((el) => {
      let topicMatchScore = 0;
      let totalTagMatchPercentage = 0;
      let topicsCompared = 0;

      const otherUserPrefByTopic = new Map();
      el.userPreferences.forEach((pref) => {
        otherUserPrefByTopic.set(pref.topic_id, pref);
      });

      userPrefByTopic.forEach((userPref, topicId) => {
        const otherPref = otherUserPrefByTopic.get(topicId);

        if (otherPref) {
          // Peso de la relación basado en roles
          const connectionWeight = getConnectionWeight(
            userPref.type,
            otherPref.type
          );

          console.log("CONEEEENCTION ", connectionWeight);

          // Aumentar puntaje de tema por el peso de la conexión
          topicMatchScore += connectionWeight;

          // Coincidencia de tags ponderada por el peso de conexión
          const commonTagsCount = userPref.tags.filter((tag) =>
            otherPref.tags.includes(tag)
          ).length;

          const totalTags = Math.max(
            userPref.tags.length,
            otherPref.tags.length
          );
          const tagMatchPercentage =
            totalTags > 0 ? (commonTagsCount / totalTags) * 100 : 100;

          // Ajustar el porcentaje de coincidencia de tags
          totalTagMatchPercentage += tagMatchPercentage * connectionWeight;
          topicsCompared++;
        }
      });

      // Promedio de coincidencia de tags entre temas comparados
      const averageTagMatchPercentage =
        topicsCompared > 0 ? totalTagMatchPercentage / topicsCompared : 0;

      // Cálculo de puntaje total y puntaje máximo posible
      // 80% del peso se basa en roles y temas, y 20% en coincidencia de tags
      const totalScore =
        topicMatchScore * 5 * 0.9 + averageTagMatchPercentage * 0.1;
      const maxScore = userPrefByTopic.size * 5 * 1.5; // Puntaje máximo posible considerando el mayor peso

      // Convertir el puntaje en un porcentaje sobre 100
      const matchPercentage = Math.min((totalScore / maxScore) * 100, 100);

      matches.push({
        user_id: el.user_id,
        matchPercentage,
      });
    });

    // Ordenar y retornar coincidencias por porcentaje
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return matches;
  } catch (error) {
    console.error(error);
  }
};

// Función para obtener el peso entre combinaciones de roles
function getConnectionWeight(role1, role2) {
  console.log(role1, role2);
  if (
    (role1 === "explorador" && role2 === "mentor") ||
    (role1 === "mentor" && role2 === "explorador")
  ) {
    return 1.5; // Mucho peso
  }
  if (role1 === "entusiasta" && role2 === "entusiasta") {
    return 1.5; // Mucho peso
  }
  if (
    (role1 === "mentor" && role2 === "entusiasta") ||
    (role1 === "entusiasta" && role2 === "mentor")
  ) {
    return 0.5;
  }
  return 1; // Peso normal para otras combinaciones
}

// Función para formatear la respuesta de preferencias de usuario
function formatResponse(data) {
  return data.map((item) => ({
    id: item.id,
    type: item.type, // Cambiado de type a role para reflejar el nuevo formato
    topic_id: item.topic_id,
    tags: item.userPreferenceTags.map((tag) => tag.tag_id),
  }));
}

const getUserPreferencesTags = async (userTopics) => {
  return await Promise.all(
    userTopics.map(async (el) => {
      const userPreferences = await UserPreferenceTag.findAll({
        where: { user_preference_id: el.id },
        attributes: ["tag_id"],
        raw: true,
      });

      // Verifica si se encontraron preferencias
      if (userPreferences.length > 0) {
        return userPreferences.map((preferencia) => ({
          tag_id: preferencia.tag_id,
        }));
      } else {
        console.log(
          `No se encontraron preferencias para el usuario con ID: ${el.id}.`
        );
        return []; // Devuelve un array vacío si no se encontraron preferencias
      }
    })
  );
};

// Función para comparar etiquetas de manera eficiente
const compareTags = (tags1, tags2) => {
  const setTags1 = new Set(tags1);
  return tags2.filter((tag) => setTags1.has(tag)).length;
};
