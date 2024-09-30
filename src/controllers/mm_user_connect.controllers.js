import { UserPreference } from "../models/user_preferences.model.js";
import { Topic } from "../models/topic.models.js";

export const prueba = async (req, res) => {
  let { user1, user2 } = req.body;
  try {
    calculateCompatibility(user1, user2);
    res.status(200).json({ message: "OK" });
  } catch (error) {}
};

const calculateCompatibility = async (user1Id, user2Id) => {
  let userID1 = [],
    userID2 = [];
  try {
    let userPreferences = await UserPreference.findAll({
      where: { user_id: user1Id },
      include: [Topic],
    });
    if (userPreferences.length > 0) {
      // Accede al ID del primer resultado
      userPreferences.forEach((el) => {
        userID1.push(el.topic_id);
      });
    } else {
      console.log("No se encontraron preferencias para este usuario.");
    }
    console.log(userID1);
    // userPreferences = await UserPreference.findAll({
    //   where: { user_id: user2Id },
    //   include: [Topic],
    // });

    // if (userPreferences.length > 0) {
    //   // Accede al ID del primer resultado
    //   userID2 = userPreferences[0].id;
    // } else {
    //   console.log("No se encontraron preferencias para este usuario.");
    // }

    // console.log(userID1, userID2);

    // Calcular el número de temas en común
    // const commonTopics = user1Topics.filter((topic) =>
    //   user2Topics.some((t) => t.topic_id === topic.topic_id)
    // );
    // let score = commonTopics.length * 10;

    // // Obtener etiquetas de ambos usuarios
    // const [user1Tags] = await db.execute(
    //   "SELECT tag FROM user_tags WHERE user_id = ?",
    //   [user1Id]
    // );
    // const [user2Tags] = await db.execute(
    //   "SELECT tag FROM user_tags WHERE user_id = ?",
    //   [user2Id]
    // );

    // // Calcular el número de etiquetas en común
    // const commonTags = user1Tags.filter((tag) =>
    //   user2Tags.some((t) => t.tag === tag.tag)
    // );
    // score += commonTags.length * 5;

    // // Calcular coincidencias en preferencias de aprendizaje/enseñanza
    // const [user1Preferences] = await db.execute(
    //   "SELECT can_teach FROM user_preferences WHERE user_id = ?",
    //   [user1Id]
    // );
    // const [user2Preferences] = await db.execute(
    //   "SELECT wants_to_learn FROM user_preferences WHERE user_id = ?",
    //   [user2Id]
    // );

    // // Si los intereses coinciden en aprendizaje/enseñanza
    // if (
    //   user1Preferences.some((pref) =>
    //     user2Preferences.some((t) => t.can_teach === pref.wants_to_learn)
    //   )
    // ) {
    //   score += 15;
    // }

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
