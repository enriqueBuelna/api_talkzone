import { UserPreference } from "../models/user_preferences.model.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { Topic } from "../models/topic.models.js";
import {
  getUserPreferencess,
  getUserProileInformation,
} from "../services/users.services.js";
import { json, Op } from "sequelize";

//USAR ESTE ENDPOINT
export const matchmakingConnect = async (req, res) => {
  let { user_id } = req.query;
  try {
    res.status(200).json(await auxiliarMatchmaking(user_id));
  } catch (error) {}
};

// const calculateCompatibility = async (user1Id, user2Id) => {
//   let userTopics1 = [],
//     userTopics2 = [];
//   let userTags1 = [],
//     userTags2 = [];
//   try {
//     //OBTIENE LOS TEMAS, EN GENERAL
//     let userPreferences = await UserPreference.findAll({
//       where: { user_id: user1Id },
//       include: [Topic],
//     });
//     if (userPreferences.length > 0) {
//       // Accede al ID del primer resultado
//       userPreferences.forEach((el) => {
//         let preferencia = {
//           topic_id: el.topic_id,
//           id: el.id,
//           type: el.type,
//         };
//         userTopics1.push(preferencia);
//       });
//     } else {
//       console.log("No se encontraron preferencias para este usuario.");
//     }

//     // console.log(userTopics1);

//     userPreferences = await UserPreference.findAll({
//       where: { user_id: user2Id },
//       include: [Topic],
//     });

//     if (userPreferences.length > 0) {
//       // Accede al ID del primer resultado
//       userPreferences.forEach((el) => {
//         let preferencia = {
//           topic_id: el.topic_id,
//           id: el.id,
//           type: el.type,
//         };
//         userTopics2.push(preferencia);
//       });
//     } else {
//       console.log("No se encontraron preferencias para este usuario.");
//     }

//     console.log(userTopics1, userTopics2);

//     // Calcular el número de temas en común
//     const commonTopics = userTopics1.filter((el) =>
//       userTopics2.some((topic) => topic.topic_id === el.topic_id)
//     );

//     let score = commonTopics.length * 10;

//     // Aplana el array de resultados y los añade a userTags1
//     userTags1.push(...(await getUserPreferencesTags(userTopics1)).flat());
//     userTags2.push(...(await getUserPreferencesTags(userTopics2)).flat());

//     // // Calcular el número de etiquetas en común
//     const commonTags = userTags1.filter((tag) =>
//       userTags2.some((t) => t.tag_id === tag.tag_id)
//     );
//     // console.log(commonTags);
//     score += commonTags.length * 5;

//     // // // Si los intereses coinciden en aprendizaje/enseñanza
//     userTopics1.forEach((el) => {
//       userTopics2.forEach((ele) => {
//         if (ele.topic_id === el.topic_id) {
//           if (
//             (ele.type === "learn" && el.type === "know") ||
//             (ele.type === "know" && el.type === "learn")
//           ) {
//             score += 15;
//           }
//         }
//       });
//     });

//     console.log(score);

//     // // Comprobar si ambos han estado activos recientemente
//     // const [user1Active] = await db.execute(
//     //   "SELECT last_active FROM users WHERE id = ?",
//     //   [user1Id]
//     // );
//     // const [user2Active] = await db.execute(
//     //   "SELECT last_active FROM users WHERE id = ?",
//     //   [user2Id]
//     // );

//     // const now = new Date();
//     // if (
//     //   (now - new Date(user1Active[0].last_active)) / 1000 < 86400 &&
//     //   (now - new Date(user2Active[0].last_active)) / 1000 < 86400
//     // ) {
//     //   score += 10;
//     // }

//     // return score;
//   } catch (error) {
//     console.error("Error al calcular compatibilidad:", error);
//   }
// };

// const calculateCompatibility = async (user_id) => {
//   try {
//     let user = formatResponse(await getUserPreferencess(user_id));
//     console.log(user);
//     // Extraer los topic_id
//     const topicIds = user.map((pref) => pref.topic_id);
//     const matchingUsers = await UserPreference.findAll({
//       attributes: ["user_id"],
//       where: {
//         topic_id: {
//           [Op.in]: topicIds, // Usamos el array extraído de los topic_id
//         },
//         user_id: {
//           [Op.ne]: user_id, // Excluir tu propio user_id de los resultados
//         },
//       },
//       group: ["user_id"], // Agrupamos por usuario para evitar duplicados,
//       raw: true,
//     });

//     let matchingUser = await Promise.all(
//       matchingUsers.map(async (el) => {
//         const userPreferences = formatResponse(
//           await getUserPreferencess(el.user_id)
//         );
//         return {
//           ...el,
//           userPreferences,
//         };
//       })
//     );

//     let matches = [];

//     // Agrupar preferencias del usuario actual por `topic_id`
//     const userPrefByTopic = new Map();
//     user.forEach((pref) => {
//       userPrefByTopic.set(pref.topic_id, pref);
//     });

//     matchingUser.forEach((el) => {
//       let howMuchTopics = 0;
//       let howMuchTopicsCondition = 0; // Learn-Know o Know-Learn
//       let howManyTags = 0;

//       // Agrupar preferencias del usuario coincidente por `topic_id`
//       const otherUserPrefByTopic = new Map();
//       el.userPreferences.forEach((pref) => {
//         otherUserPrefByTopic.set(pref.topic_id, pref);
//       });

//       userPrefByTopic.forEach((userPref, topicId) => {
//         const otherPref = otherUserPrefByTopic.get(topicId);

//         if (otherPref) {
//           // Verificar la condición Learn-Know o Know-Learn
//           if (
//             (userPref.type === "know" && otherPref.type === "learn") ||
//             (userPref.type === "learn" && otherPref.type === "know")
//           ) {
//             howMuchTopicsCondition++;
//           } else {
//             // Coincidencia de topics
//             howMuchTopics++;
//           }

//           // Comparar tags si ambos usuarios tienen etiquetas
//           if (userPref.tags.length > 0 && otherPref.tags.length > 0) {
//             howManyTags += compareTags(userPref.tags, otherPref.tags);
//           }
//         }
//       });

//       // Calcular el puntaje total -- ME FALTA CHECAR LO DEL PORCENTAJE DE COINCIDENCIA
//       let total = (howManyTags + howMuchTopics * 5 + howMuchTopicsCondition * 10 / 200) * 10;

//       // // Guardar el resultado
//       matches.push({ user_id: el.user_id, total });
//     });

//     // // Ordenar los resultados por puntaje
//     matches.sort((a, b) => b.total - a.total);

//   } catch (error) {}
// };

// const calculateCompatibility = async (user_id) => {
//   try {
//     let user = formatResponse(await getUserPreferencess(user_id)); // Obtener preferencias del usuario
//     const topicIds = user.map((pref) => pref.topic_id); // Extraer los topic_id
//     const matchingUsers = await UserPreference.findAll({
//       attributes: ["user_id"],
//       where: {
//         topic_id: {
//           [Op.in]: topicIds, // Usamos el array extraído de los topic_id
//         },
//         user_id: {
//           [Op.ne]: user_id, // Excluir tu propio user_id de los resultados
//         },
//       },
//       group: ["user_id"], // Agrupamos por usuario para evitar duplicados
//       raw: true,
//     });
//     // console.log(user);
//     let matchingUser = await Promise.all(
//       matchingUsers.map(async (el) => {
//         const userPreferences = formatResponse(
//           await getUserPreferencess(el.user_id)
//         );
//         // console.log("Usuario B", userPreferences);

//         return {
//           ...el,
//           userPreferences,
//         };
//       })
//     );
//     let matches = [];

//     // Agrupar preferencias del usuario actual por `topic_id`
//     const userPrefByTopic = new Map();
//     user.forEach((pref) => {
//       userPrefByTopic.set(pref.topic_id, pref);
//     });

//     matchingUser.forEach((el) => {
//       let howMuchTopics = 0;
//       let howMuchTopicsCondition = 0; // Learn-Know o Know-Learn
//       let howManyTags = 0;

//       // Agrupar preferencias del usuario coincidente por `topic_id`
//       const otherUserPrefByTopic = new Map();
//       el.userPreferences.forEach((pref) => {
//         otherUserPrefByTopic.set(pref.topic_id, pref);
//       });

//       // console.log(otherUserPrefByTopic);
//       // Recorrer preferencias del usuario actual para encontrar coincidencias con otros usuarios
//       userPrefByTopic.forEach((userPref, topicId) => {
//         const otherPref = otherUserPrefByTopic.get(topicId);
//         console.log(
//           "Mi other pref\n",
//           otherPref,
//           "\nMi user pref\n",
//           userPref,
//           "Mi user topic_id\n",
//           topicId
//         );
//         if (otherPref) {
//           // Verificar la condición Learn-Know o Know-Learn
//           if (
//             (userPref.type === "know" && otherPref.type === "learn") ||
//             (userPref.type === "learn" && otherPref.type === "know")
//           ) {
//             howMuchTopicsCondition++;
//           } else {
//             // Coincidencia de temas en general
//             howMuchTopics++;
//           }

//           // Comparar tags si ambos usuarios tienen etiquetas
//           if (userPref.tags.length > 0 && otherPref.tags.length > 0) {
//             howManyTags += compareTags(userPref.tags, otherPref.tags);
//             console.log(howManyTags);
//           }
//         } else {
//           // Penaliza por cada tema que no coincide
//           howMuchTopics -= 1; // Ajusta el penalizador según la lógica de tu aplicación
//           return; // Salimos de este bucle, ya que no hay coincidencia
//         }
//       });

//       // Calcular el puntaje total
//       const userTotalTopics = user.length; // Total de temas que tiene el usuario actual
//       const otherTotalTopics = el.userPreferences.length; // Total de temas del otro usuario
//       const totalTopicsToCompare = Math.max(userTotalTopics, otherTotalTopics); // Total de temas comparados es el mayor número

//       const topicScore = howMuchTopics * 5; // Puntuación de coincidencia de temas
//       const conditionScore = howMuchTopicsCondition * 10; // Puntuación de condición Learn-Know
//       const tagScore = howManyTags * 2; // Puntuación de coincidencia de tags
//       const totalScore = topicScore + conditionScore + tagScore;

//       // Si el usuario actual tiene más temas que el otro, reducimos su porcentaje final
//       const matchPercentage = Math.min(
//         (totalScore / (totalTopicsToCompare * 10)) * 100,
//         100
//       );

//       // Guardar el resultado
//       matches.push({ user_id: el.user_id, matchPercentage });
//     });

//     // Ordenar los resultados por porcentaje de coincidencia
//     matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
//     console.log(matches);
//     return matches; // Devuelve los usuarios ordenados por mejor compatibilidad
//   } catch (error) {
//     console.error(error);
//   }
// };

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

const calculateCompatibility = async (user_id) => {
  try {
    let user = formatResponse(await getUserPreferencess(user_id));
    const topicIds = user.map((pref) => pref.topic_id);
    const matchingUsers = await UserPreference.findAll({
      attributes: ["user_id"],
      where: {
        topic_id: {
          [Op.in]: topicIds,
        },
        user_id: {
          [Op.ne]: user_id,
        },
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
          userPreferences, // Incluimos las preferencias del usuario aquí
        };
      })
    );

    let matches = [];
    const userPrefByTopic = new Map();
    user.forEach((pref) => {
      userPrefByTopic.set(pref.topic_id, pref);
    });

    matchingUser.forEach(async (el) => {
      let howMuchTopics = 0;
      let howMuchTopicsCondition = 0;
      let howManyTags = 0;

      const otherUserPrefByTopic = new Map();
      el.userPreferences.forEach((pref) => {
        otherUserPrefByTopic.set(pref.topic_id, pref);
      });

      userPrefByTopic.forEach((userPref, topicId) => {
        const otherPref = otherUserPrefByTopic.get(topicId);

        if (!otherPref) {
          // Penaliza si el otro usuario no tiene este tema
          howMuchTopics -= 1;
          return;
        }

        if (
          (userPref.type === "know" && otherPref.type === "learn") ||
          (userPref.type === "learn" && otherPref.type === "know")
        ) {
          howMuchTopicsCondition++;
        } else {
          howMuchTopics++;
        }

        // Comparar tags
        if (userPref.tags.length > 0 && otherPref.tags.length > 0) {
          const commonTagsCount = userPref.tags.filter((tag) =>
            otherPref.tags.includes(tag)
          ).length;
          howManyTags += commonTagsCount; // Sumar coincidencias de tags
        }
      });

      // Calcular el puntaje total
      const userTotalTags = Array.from(userPrefByTopic.values()).reduce(
        (sum, pref) => sum + pref.tags.length,
        0
      );

      // Calcular el porcentaje de coincidencia de tags
      let tagMatchPercentage = 0;
      if (userTotalTags > 0) {
        const uniqueUserTags = new Set();
        userPrefByTopic.forEach((pref) => {
          pref.tags.forEach((tag) => uniqueUserTags.add(tag));
        });

        const nonMatchingTagsCount = [...uniqueUserTags].filter(
          (tag) =>
            ![...otherUserPrefByTopic.values()].some((pref) =>
              pref.tags.includes(tag)
            )
        ).length;

        const totalUserTags = uniqueUserTags.size;
        const totalCommonTags = howManyTags;

        if (nonMatchingTagsCount === 0) {
          tagMatchPercentage = (totalCommonTags / totalUserTags) * 100;
        } else {
          tagMatchPercentage =
            (totalCommonTags / totalUserTags) *
            100 *
            (1 - nonMatchingTagsCount / totalUserTags);
        }
      }

      const totalScore =
        howMuchTopics * 5 + howMuchTopicsCondition * 10 + tagMatchPercentage;
      const matchPercentage = Math.min((totalScore / 100) * 100, 100);
      // Incluir las preferencias del usuario junto con el porcentaje de coincidencia
      matches.push({
        user_id: el.user_id,
        matchPercentage,
      });
    });

    // Ordenar por porcentaje de coincidencia
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Devolver el array de coincidencias con preferencias y porcentaje
    return matches;
  } catch (error) {
    console.error(error);
  }
};

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

function formatResponse(data) {
  return data.map((item) => ({
    id: item.id,
    type: item.type,
    topic_id: item.topic_id,
    tags: item.userPreferenceTags.map((tag) => tag.tag_id),
  }));
}
