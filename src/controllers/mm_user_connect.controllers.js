import { UserPreference } from "../models/user_preferences.model.js";
import { UserPreferenceTag } from "../models/user_preference_tag.model.js";
import { Topic } from "../models/topic.models.js";

export const prueba = async (req, res) => {
  let { user1, user2 } = req.body;
  try {
    calculateCompatibility(user1, user2);
    res.status(200).json({ message: "OK" });
  } catch (error) {}
};

const calculateCompatibility = async (user1Id, user2Id) => {
  let userTopics1 = [],
    userTopics2 = [];
  let userTags1 = [],
    userTags2 = [];
  try {
    //OBTIENE LOS TEMAS, EN GENERAL
    let userPreferences = await UserPreference.findAll({
      where: { user_id: user1Id },
      include: [Topic],
    });
    if (userPreferences.length > 0) {
      // Accede al ID del primer resultado
      userPreferences.forEach((el) => {
        let preferencia = {
          topic_id: el.topic_id,
          id: el.id,
          type: el.type,
        };
        userTopics1.push(preferencia);
      });
    } else {
      console.log("No se encontraron preferencias para este usuario.");
    }

    // console.log(userTopics1);

    userPreferences = await UserPreference.findAll({
      where: { user_id: user2Id },
      include: [Topic],
    });

    if (userPreferences.length > 0) {
      // Accede al ID del primer resultado
      userPreferences.forEach((el) => {
        let preferencia = {
          topic_id: el.topic_id,
          id: el.id,
          type: el.type,
        };
        userTopics2.push(preferencia);
      });
    } else {
      console.log("No se encontraron preferencias para este usuario.");
    }

    console.log(userTopics1, userTopics2);

    // Calcular el número de temas en común
    const commonTopics = userTopics1.filter((el) =>
      userTopics2.some((topic) => topic.topic_id === el.topic_id)
    );

    let score = commonTopics.length * 10;

    // Aplana el array de resultados y los añade a userTags1
    userTags1.push(...(await getUserPreferencesTags(userTopics1)).flat());
    userTags2.push(...(await getUserPreferencesTags(userTopics2)).flat());

    // // Calcular el número de etiquetas en común
    const commonTags = userTags1.filter((tag) =>
      userTags2.some((t) => t.tag_id === tag.tag_id)
    );
    // console.log(commonTags);
    score += commonTags.length * 5;

    // // // Si los intereses coinciden en aprendizaje/enseñanza
    userTopics1.forEach((el) => {
      userTopics2.forEach((ele) => {
        if (ele.topic_id === el.topic_id) {
          if (
            (ele.type === "learn" && el.type === "know") ||
            (ele.type === "know" && el.type === "learn")
          ) {
            score += 15;
          }
        }
      });
    });

    console.log(score);

    // // Comprobar si ambos han estado activos recientemente
    // const [user1Active] = await db.execute(
    //   "SELECT last_active FROM users WHERE id = ?",
    //   [user1Id]
    // );
    // const [user2Active] = await db.execute(
    //   "SELECT last_active FROM users WHERE id = ?",
    //   [user2Id]
    // );

    // const now = new Date();
    // if (
    //   (now - new Date(user1Active[0].last_active)) / 1000 < 86400 &&
    //   (now - new Date(user2Active[0].last_active)) / 1000 < 86400
    // ) {
    //   score += 10;
    // }

    // return score;
  } catch (error) {
    console.error("Error al calcular compatibilidad:", error);
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
