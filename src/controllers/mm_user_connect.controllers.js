import { UserPreference } from "../models/user_preferences.model.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { Topic } from "../models/topic.models.js";
import {
  getUserPreferencess,
  getUserProileInformation,
} from "../services/users.services.js";
import { json, Op } from "sequelize";
import { Follower } from "../models/follower.model.js";
import { User } from "../models/user.model.js";
import { Tag } from "../models/tag.models.js";

//USAR ESTE ENDPOINT
export const matchmakingConnect = async (req, res) => {
  let { user_id } = req.query;
  try {
    res.status(200).json(await auxiliarMatchmaking(user_id));
  } catch (error) {}
};

export const searchConnect = async (req, res) => {
  let { search, user_id } = req.query;
  try {
    let idsPeople = await getIdsPeople(search, user_id);
    res.status(201).json(await auxiliarMatchmakingSearch(user_id, idsPeople));
  } catch (error) {
    console.log(error);
  }
};

const getIdsPeople = async (search, user_id) => {
  try {
    let userId = [user_id, 'dbb9d930-e338-40c2-9162-d7a04ab685d5', 'dbb9d930-e338-40c2-9162-d7a04ab6851a']
    const uniqueUserIds = new Set(); // Un conjunto para almacenar los user_id únicos
    const tags = await UserPreferenceTag.findAll({
      include: [
        {
          model: Tag,
          where: {
            tag_name: { [Op.like]: `%${search}%` },
          },
        },
        {
          association: "userPreferences",
          model: UserPreference,
          where: {
            is_active: true,
            user_id: { [Op.ne]: user_id }, // Diferente al usuario actual
          },
          attributes: ["user_id"],
        },
      ],
    });
    ///pcupo extraer el userPreferences.user_id
    tags.forEach((tag) => uniqueUserIds.add(tag.userPreferences.user_id));
    const users = await User.findAll({
      where: {
        username: { [Op.like]: `%${search}%` },
        id: { [Op.notIn]: userId  }, // Diferente al usuario actual
      },
    });
    ///aqui extraer el user_id
    users.forEach((user) => uniqueUserIds.add(user.id));
    const topics = await UserPreference.findAll({
      where: {
        user_id: { [Op.ne]: user_id }, // Diferente al usuario actual
        is_active: true,
      },
      include: [
        {
          model: Topic,
          where: {
            topic_name: { [Op.like]: `%${search}%` },
          },
        },
      ],
      attributes: ["user_id"],
    });
    topics.forEach((topic) => uniqueUserIds.add(topic.user_id));

    // Convertir el conjunto a un arreglo si lo necesitas en este formato
    const uniqueUserIdArray = Array.from(uniqueUserIds);
    console.log(uniqueUserIdArray);
    return uniqueUserIdArray;
  } catch (error) {
    console.log(error);
  }
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

export const auxiliarMatchmakingSearch = async (user_id, idsPeople) => {
  try {
    let usuarios = await calculateCompatibilitySearch(user_id, idsPeople);
    //arreglo
    console.log(usuarios);
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
    //ocupo conseguir a las personas que sigo, para que no me salgan otra vez
    const followed = await Follower.findAll({
      where: { follower_id: user_id },
      attributes: ["followed_id"],
    });
    const followedId = followed.map((el) => el.followed_id);
    const topicIds = user.map((pref) => pref.topic_id);
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
        is_active: true,
      },
      include: [
        {
          association: 'user_preference_to_user',
          model: User,
          where: {
            is_banned: false,
          },
        },
      ],

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
    console.log(matchingUser);
    let matches = [];
    const userPrefByTopic = new Map();
    user.forEach((pref) => {
      userPrefByTopic.set(pref.topic_id, pref);
    });

    matchingUser.forEach((el) => {
      let topicMatchScore = 0;
      let totalTagMatchPercentage = 0;
      let topicsCompared = 0;
      let topicsWithTagsCompared = 0;

      // Crear un mapa de preferencias del otro usuario basado en temas
      const otherUserPrefByTopic = new Map();
      el.userPreferences.forEach((pref) => {
        otherUserPrefByTopic.set(pref.topic_id, pref);
      });

      // Variable para verificar si el usuario base tiene tags
      let baseUserHasTags = false;

      // Comparar temas del usuario base con los del otro usuario
      userPrefByTopic.forEach((userPref, topicId) => {
        const otherPref = otherUserPrefByTopic.get(topicId);

        if (userPref.tags.length > 0) baseUserHasTags = true; // Detectar si el usuario base tiene tags

        if (otherPref) {
          // Coincidencia de temas
          const connectionWeight = getConnectionWeight(
            userPref.type,
            otherPref.type
          );

          // Incrementar puntaje de tema por el peso de conexión
          topicMatchScore += connectionWeight;

          // Manejar el caso de las tags
          if (userPref.tags.length > 0) {
            if (otherPref.tags.length > 0) {
              // Comparar tags y calcular porcentaje de coincidencia ponderado
              const commonTagsCount = userPref.tags.filter((tag) =>
                otherPref.tags.includes(tag)
              ).length;

              const allTagsCount = new Set([
                ...userPref.tags,
                ...otherPref.tags,
              ]).size; // Todos los tags únicos de ambos

              const tagMatchPercentage =
                allTagsCount > 0 ? (commonTagsCount / allTagsCount) * 100 : 0;

              totalTagMatchPercentage += tagMatchPercentage * connectionWeight;
              topicsWithTagsCompared++;
            } else {
              // Si no hay tags en el otro usuario, no se suman puntos
              totalTagMatchPercentage += 0;
              topicsWithTagsCompared++;
            }
          }
          topicsCompared++;
        } else {
          // Penalización por temas no coincidentes (opcional)
          topicMatchScore += 0;
          topicsCompared++;
        }
      });

      // Calcular el puntaje ponderado
      const weightForTags = baseUserHasTags ? 0.2 : 0; // Peso de los tags (0 si el usuario base no tiene tags)
      const weightForTopics = 1 - weightForTags; // Peso del puntaje por temas

      const averageTagMatchPercentage =
        topicsWithTagsCompared > 0
          ? totalTagMatchPercentage / topicsWithTagsCompared
          : 0;

      const scaledTagScore = (averageTagMatchPercentage / 100) * topicsCompared; // Escalar el puntaje de tags

      const totalScore =
        topicMatchScore * weightForTopics + scaledTagScore * weightForTags; // Escalar los tags al peso correcto

      // Puntaje máximo posible basado en los temas del usuario base
      const maxScore = userPrefByTopic.size * 1.5; // Basado en el peso máximo por tema

      // Convertir el puntaje en un porcentaje sobre 100
      const matchPercentage =
        maxScore > 0 ? Math.min((totalScore / maxScore) * 100, 100) : 0;

      // Log para depuración
      console.log(`Usuario: ${el.user_id}`);
      console.log(`Temas comparados: ${topicsCompared}`);
      console.log(`Temas con tags comparados: ${topicsWithTagsCompared}`);
      console.log(`Puntaje por temas: ${topicMatchScore}`);
      console.log(`Promedio de tags: ${averageTagMatchPercentage}`);
      console.log(`Puntaje total: ${totalScore}`);
      console.log(`Puntaje máximo: ${maxScore}`);
      console.log(`Porcentaje de coincidencia: ${matchPercentage}`);

      // Agregar el resultado al arreglo de coincidencias
      matches.push({
        user_id: el.user_id,
        matchPercentage,
      });
    });

    return matches;
  } catch (error) {
    console.error(error);
  }
};

const calculateCompatibilitySearch = async (user_id, idsPeople) => {
  try {
    let user = formatResponse(await getUserPreferencess(user_id));
    //ocupo conseguir a las personas que sigo, para que no me salgan otra vez
    const followed = await Follower.findAll({
      where: { follower_id: user_id },
      attributes: ["followed_id"],
    });
    const followedId = followed.map((el) => el.followed_id);
    let matchingUsers = idsPeople.filter((id) => !followedId.includes(id));
    let matchingUser = await Promise.all(
      matchingUsers.map(async (el) => {
        const userPreferences = formatResponse(await getUserPreferencess(el));
        el = {
          user_id: el,
        };
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
      let topicsWithTagsCompared = 0;

      // Crear un mapa de preferencias del otro usuario basado en temas
      const otherUserPrefByTopic = new Map();
      el.userPreferences.forEach((pref) => {
        otherUserPrefByTopic.set(pref.topic_id, pref);
      });

      // Variable para verificar si el usuario base tiene tags
      let baseUserHasTags = false;

      // Comparar temas del usuario base con los del otro usuario
      userPrefByTopic.forEach((userPref, topicId) => {
        const otherPref = otherUserPrefByTopic.get(topicId);

        if (userPref.tags.length > 0) baseUserHasTags = true; // Detectar si el usuario base tiene tags

        if (otherPref) {
          // Coincidencia de temas
          const connectionWeight = getConnectionWeight(
            userPref.type,
            otherPref.type
          );

          // Incrementar puntaje de tema por el peso de conexión
          topicMatchScore += connectionWeight;

          // Manejar el caso de las tags
          if (userPref.tags.length > 0) {
            if (otherPref.tags.length > 0) {
              // Comparar tags y calcular porcentaje de coincidencia ponderado
              const commonTagsCount = userPref.tags.filter((tag) =>
                otherPref.tags.includes(tag)
              ).length;

              const allTagsCount = new Set([
                ...userPref.tags,
                ...otherPref.tags,
              ]).size; // Todos los tags únicos de ambos

              const tagMatchPercentage =
                allTagsCount > 0 ? (commonTagsCount / allTagsCount) * 100 : 0;

              totalTagMatchPercentage += tagMatchPercentage * connectionWeight;
              topicsWithTagsCompared++;
            } else {
              // Si no hay tags en el otro usuario, no se suman puntos
              totalTagMatchPercentage += 0;
              topicsWithTagsCompared++;
            }
          }
          topicsCompared++;
        } else {
          // Penalización por temas no coincidentes (opcional)
          topicMatchScore += 0;
          topicsCompared++;
        }
      });

      // Calcular el puntaje ponderado
      const weightForTags = baseUserHasTags ? 0.2 : 0; // Peso de los tags (0 si el usuario base no tiene tags)
      const weightForTopics = 1 - weightForTags; // Peso del puntaje por temas

      const averageTagMatchPercentage =
        topicsWithTagsCompared > 0
          ? totalTagMatchPercentage / topicsWithTagsCompared
          : 0;

      const scaledTagScore = (averageTagMatchPercentage / 100) * topicsCompared; // Escalar el puntaje de tags

      const totalScore =
        topicMatchScore * weightForTopics + scaledTagScore * weightForTags; // Escalar los tags al peso correcto

      // Puntaje máximo posible basado en los temas del usuario base
      const maxScore = userPrefByTopic.size * 1.5; // Basado en el peso máximo por tema

      // Convertir el puntaje en un porcentaje sobre 100
      const matchPercentage =
        maxScore > 0 ? Math.min((totalScore / maxScore) * 100, 100) : 0;

      // Log para depuración
      console.log(`Usuario: ${el.user_id}`);
      console.log(`Temas comparados: ${topicsCompared}`);
      console.log(`Temas con tags comparados: ${topicsWithTagsCompared}`);
      console.log(`Puntaje por temas: ${topicMatchScore}`);
      console.log(`Promedio de tags: ${averageTagMatchPercentage}`);
      console.log(`Puntaje total: ${totalScore}`);
      console.log(`Puntaje máximo: ${maxScore}`);
      console.log(`Porcentaje de coincidencia: ${matchPercentage}`);

      // Agregar el resultado al arreglo de coincidencias
      matches.push({
        user_id: el.user_id,
        matchPercentage,
      });
    });

    return matches;
  } catch (error) {
    console.error(error);
  }
};

// Función para obtener el peso entre combinaciones de roles
function getConnectionWeight(role1, role2) {
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

// function calculateMatchScore(userPrefByTopic, matchingUsers) {
//   const matches = [];

//   matchingUsers.forEach((el) => {
//     let topicMatchScore = 0;
//     let totalTagMatchPercentage = 0;
//     let topicsCompared = 0;

//     // Crear un mapa de preferencias del otro usuario basado en temas
//     const otherUserPrefByTopic = new Map();
//     el.userPreferences.forEach((pref) => {
//       otherUserPrefByTopic.set(pref.topic_id, pref);
//     });

//     // Comparar temas entre usuarios
//     userPrefByTopic.forEach((userPref, topicId) => {
//       const otherPref = otherUserPrefByTopic.get(topicId);

//       if (otherPref) {
//         // Obtener peso de conexión basado en roles
//         const connectionWeight = getConnectionWeight(
//           userPref.type,
//           otherPref.type
//         );

//         // Incrementar puntaje de tema por el peso de conexión
//         topicMatchScore += connectionWeight;

//         // Comparar tags y calcular porcentaje de coincidencia ponderado
//         const commonTagsCount = userPref.tags.filter((tag) =>
//           otherPref.tags.includes(tag)
//         ).length;

//         const totalTags = Math.max(userPref.tags.length, otherPref.tags.length);

//         const tagMatchPercentage =
//           totalTags > 0 ? (commonTagsCount / totalTags) * 100 : 0;

//         totalTagMatchPercentage += tagMatchPercentage * connectionWeight;
//         topicsCompared++;
//       }
//     });

//     // Validar comparación de temas
//     if (topicsCompared === 0) {
//       console.warn(`No hay temas en común para el usuario ${el.user_id}`);
//       matches.push({
//         user_id: el.user_id,
//         matchPercentage: 0, // Sin temas en común no hay coincidencia
//       });
//       return;
//     }

//     // Promedio de coincidencia de tags
//     const averageTagMatchPercentage = (totalTagMatchPercentage / topicsCompared)/100;

//     // Cálculo del puntaje total
//     const totalScore =
//       topicMatchScore * 5 * 0.8 + averageTagMatchPercentage * 0.2;

//     // Calcular puntaje máximo posible dinámicamente
//     const maxScore = Array.from(userPrefByTopic.values()).reduce(
//       (acc, userPref) => {
//         const otherPref = otherUserPrefByTopic.get(userPref.topic_id);
//         if (otherPref) {
//           return (
//             acc +
//             getConnectionWeight(userPref.type, otherPref.type) * user.length
//           );
//         }
//         return acc;
//       },
//       0
//     );

//     // Convertir el puntaje en un porcentaje sobre 100
//     const matchPercentage =
//       maxScore > 0 ? Math.min((totalScore / maxScore) * 100, 100) : 0;

//     matches.push({
//       user_id: el.user_id,
//       matchPercentage,
//     });

//     // Log para depuración
//     console.log(`Usuario: ${el.user_id}`);
//     console.log(`Temas comparados: ${topicsCompared}`);
//     console.log(`Puntaje por temas: ${topicMatchScore}`);
//     console.log(`Promedio de tags: ${averageTagMatchPercentage}`);
//     console.log(`Puntaje total: ${totalScore}`);
//     console.log(`Puntaje máximo: ${maxScore}`);
//     console.log(`Porcentaje de coincidencia: ${matchPercentage}`);
//   });

//   return matches;
// }
