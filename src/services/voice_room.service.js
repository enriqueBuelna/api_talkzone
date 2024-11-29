import { where } from "sequelize";
import { Topic } from "../models/topic.models.js";
import { User } from "../models/user.model.js";
import { VoiceRoom } from "../models/voice_rooms.models.js";
import { createVoiceRoomTag } from "./voice_room_tag.services.js";
import { VoiceRoomMember } from "../models/voice_room_member.model.js";
import { VoiceRoomTag } from "../models/voice_room_tag.model.js";
import { Tag } from "../models/tag.models.js";
import { getUserPreferencess } from "./users.services.js";
import { Follower } from "../models/follower.model.js";
import { createNotification } from "./notification.services.js";
import { RoomRating } from "../models/room_rating.model.js";
import { UserHostRanking } from "../models/user_host_ranking.model.js";
import { RoomLog } from "../models/room_logs.model.js";
import { Op } from "sequelize";
export const verifyStatuss = async (room_id) => {
  try {
    const exists = await VoiceRoom.findByPk(room_id);
    return exists;
  } catch (error) {
    console.log(error);
  }
};

export const createVoiceRoomService = async (
  room_name,
  topic_id,
  host_user_id,
  tags,
  type
) => {
  try {
    const topic = Topic.findByPk(topic_id);
    const host = User.findByPk(host_user_id);

    if (!topic || !host) {
      throw Error("Algo salio mal, no existe topic o host en la base de datos");
    }

    const voice_room = await VoiceRoom.create({
      room_name,
      topic_id,
      host_user_id,
      type,
    });
    await VoiceRoomMember.create({
      room_id: voice_room.id,
      user_id: host_user_id,
      joined_at: new Date(),
      left_at: null,
      type: "host",
      in_stage: true,
    });

    let followers = await Follower.findAll({
      where: { followed_id: host_user_id },
    });
    followers.forEach((el) => console.log(el.follower_id));

    await Promise.all(
      followers.map(async (follower) => {
        await createNotification(
          host_user_id,
          follower.follower_id,
          "room_open",
          null,
          null,
          null,
          null,
          voice_room.id
        );
      })
    );
    //DESCOMENTAR ESTO , 05 DE NOVIEMBRE
    // await Promise.all(
    //   tags.map(async (tag) => {
    //     await createVoiceRoomTag(voice_room.id, tag.tag_id);
    //   })
    // );
    return voice_room;
  } catch (error) {
    console.log(error);
  }
};

export const getVoiceRoomByIdService = async (room_id) => {
  try {
    let room = VoiceRoom.findAll({
      where: { id: room_id },
      include: [
        {
          model: VoiceRoomMember,
          include: [
            {
              association: "voice_room_member_to_user",
              model: User,
              attributes: ["username", "profile_picture", "id"],
            },
          ],
        },
        {
          model: Topic,
          attributes: ["topic_name"],
        },
        {
          model: VoiceRoomTag,
          include: [
            {
              association: "voice_room_tag_to_tag",
              model: Tag,
              attributes: ["tag_name"],
            },
          ],
        },
      ],
    });
    if (!room) {
      throw Error("No existe esa sala");
    }
    return room;
  } catch (error) {}
};

// export const getVoiceRooms = async (user_id, filter) => {
//   try {
//     let topics_ids = await getUserPreferencess(user_id);
//     topics_ids = topics_ids.map((item) => item.topic_id);
//     let type = ["mentor", "entusiasta", "explorador"];

//     if (filter) {
//       if (filter.topicsId) {
//         topics_ids = filter.topicsId;
//       }
//       if (filter.type) {
//         type = filter.type;
//       }
//     }
//     let rooms = await VoiceRoom.findAll({
//       where: { topic_id: topics_ids, room_status: "active", type: type },
//       include: [
//         {
//           model: VoiceRoomMember,
//           include: [
//             {
//               association: "user_information_voice_room",
//               model: User,
//               attributes: ["username", "profile_picture", "id"],
//             },
//           ],
//           attributes: ["id"],
//           where: { left_at: null },
//         },
//         {
//           model: Topic,
//           attributes: ["topic_name"],
//         },
//         {
//           model: VoiceRoomTag,
//           include: [
//             {
//               association: "voice_room_tag_to_tag",
//               model: Tag,
//               attributes: ["tag_name"],
//             },
//           ],
//           attributes: ["tag_id"],
//         },
//         {
//           model: User,
//           as: "host_user", 
//           attributes: ["username", "profile_picture", "id"], 
//           include: [
//             {
//               model: UserHostRanking,
//               attributes: ["average_rating", "total_ratings"],
//               as: "rating_",
//             },
//           ],
//         },
//       ],
//       attributes: ["id", "room_name", "topic_id", "room_status"],
//     });

//     return rooms;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getVoiceRooms = async (user_id, filter) => {
  try {
    // Obtener los IDs de los temas del usuario
    let topics_ids = await getUserPreferencess(user_id);
    topics_ids = topics_ids.map((item) => item.topic_id);
    let type = ["mentor", "entusiasta", "explorador"];

    // Aplicar filtros de temas y tipo
    if (filter) {
      if (filter.topicsId) {
        topics_ids = filter.topicsId;
      }
      if (filter.type) {
        type = filter.type;
      }
    }

    // Parámetros de paginación (default page=1, limit=10)
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const offset = (page - 1) * limit;

    // Buscar salas con paginación y orden
    const rooms = await VoiceRoom.findAll({
      where: {
        topic_id: topics_ids,
        room_status: "active",
        type: type,
      },
      include: [
        {
          model: VoiceRoomMember,
          include: [
            {
              association: "user_information_voice_room",
              model: User,
              attributes: ["username", "profile_picture", "id"],
            },
          ],
          attributes: ["id"],
          where: { left_at: null },
        },
        {
          model: Topic,
          attributes: ["topic_name"],
        },
        {
          model: VoiceRoomTag,
          include: [
            {
              association: "voice_room_tag_to_tag",
              model: Tag,
              attributes: ["tag_name"],
            },
          ],
          attributes: ["tag_id"],
        },
        {
          model: User,
          as: "host_user",
          attributes: ["username", "profile_picture", "id"],
          include: [
            {
              model: UserHostRanking,
              attributes: ["average_rating", "total_ratings"],
              as: "rating_",
            },
          ],
        },
      ],
      attributes: ["id", "room_name", "topic_id", "room_status"],
      order: [
        // Ordenar por relación: host_user -> rating_ -> average_rating
        [{ model: User, as: "host_user" }, { model: UserHostRanking, as: "rating_" }, "average_rating", "DESC"],
      ],
      limit, // Aplicar límite
      offset, // Aplicar desplazamiento
    });

    return rooms;
  } catch (error) {
    console.log(error);
    throw error; // Lanza el error para que el caller lo maneje si es necesario
  }
};

export const addMemberUser = async (room_id, user_id) => {
  try {
    // const newMember = await VoiceRoomMember.create({
    //   room_id,
    //   user_id,
    // });

    let siExiste = true;

    const existingMember = await VoiceRoomMember.findOne({
      where: { room_id, user_id },
    });

    let host = await VoiceRoom.findOne({
      where: { id: room_id },
      attributes: ["host_user_id"],
    });

    const user = await User.findOne({
      where: { id: user_id },
      attributes: ["id", "profile_picture", "username"],
    });

    let roomLog;

    if (existingMember) {
      //para cuando un usuario ya entro a la sala

      let in_stage = false;
      if (host.host_user_id === user.id) {
        in_stage = true;
      } else {
        roomLog = await RoomLog.create({
          room_id,
          user_id,
          host_user_id: host.host_user_id,
        });
      }
      // Si el usuario había salido, actualizamos los tiempos para indicar que ha vuelto a entrar
      await existingMember.update({
        joined_at: new Date(), // Actualizamos la fecha de ingreso
        left_at: null, // Ponemos left_at en null para indicar que está dentro
        in_stage,
      });
    } else {
      // Si no hay registro previo, creamos uno nuevo
      let in_stage = false;
      let type = "member";
      if (host.host_user_id === user.id) {
        in_stage = true;
        type = "host";
      }
      siExiste = false;
      await VoiceRoomMember.create({
        room_id,
        user_id,
        joined_at: new Date(),
        left_at: null,
        in_stage,
        type,
      });

      roomLog = await RoomLog.create({
        room_id,
        user_id,
        host_user_id: host.host_user_id,
      });
    }

    // Usa setDataValue para añadir la propiedad
    user.setDataValue(
      "type",
      host.host_user_id === user.id ? "host" : "member"
    );

    if (siExiste) {
      user.setDataValue("in_stage", existingMember.dataValues.in_stage);
    } else {
      if (host.host_user_id === user.id) {
        user.setDataValue("in_stage", true);
      } else {
        user.setDataValue("in_stage", false);
      }
    }
    if (roomLog) {
      user.setDataValue("roomLog", roomLog.id);
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getAllMemberUsers = async (room_id) => {
  try {
    let members = await VoiceRoomMember.findAll({
      where: {
        room_id,
        left_at: null, // Solo selecciona los usuarios cuyo left_at sea null
      },
      include: [
        {
          model: User,
          association: VoiceRoomMember.associations.user_information_voice_room,
          attributes: ["id", "username", "profile_picture"],
        },
      ],
    });

    let room = await VoiceRoom.findOne({
      where: { id: room_id },
      attributes: ["host_user_id"],
    });

    // Mapea los resultados para obtener solo la información del usuario
    members = members.map((item) => {
      const userInfo = item.user_information_voice_room;

      // Establece el tipo de usuario: "host" o "member"
      if (userInfo.id === room.host_user_id) {
        userInfo.setDataValue("type", "host");
      } else {
        userInfo.setDataValue("type", "member");
      }

      // Añade el atributo `in_stage` tomando el valor de `item.in_stage`
      userInfo.setDataValue("in_stage", item.in_stage);

      return userInfo;
    });
    // console.log(members);
    return members;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error("Error fetching members:", error);
  }
};

export const userLeft = async (room_id, user_id, roomLogId) => {
  try {
    const member = await VoiceRoomMember.findOne({
      where: { room_id, user_id, left_at: null },
    });

    let host = await VoiceRoom.findOne({
      where: { id: room_id },
      attributes: ["host_user_id"],
    });

    if (!member) {
      throw new Error("El usuario no está actualmente en la sala de voz.");
    }

    if (host.host_user_id !== user_id && roomLogId) {
      let roomLog = await RoomLog.findOne({
        where: { id: roomLogId },
      });

      await roomLog.update({
        left_at: new Date(),
      });
    }
    console.log("azaaaaaaaaaaaaa");
    // Actualizamos el campo left_at con la hora de salida
    await member.update({
      left_at: new Date(),
      in_stage: false,
    });
    console.log("LLEGO AQUI");
  } catch (error) {
    console.log(error);
  }
};

export const changeInStage = async (option, room_id, user_id) => {
  try {
    const member = await VoiceRoomMember.findOne({
      where: { room_id, user_id },
    });

    if (!member) {
      throw new Error("El usuario no está actualmente en la sala de voz.");
    }
    await member.update({
      in_stage: option,
    });
  } catch (error) {}
};

export const closeVoiceRoom = async (room_id) => {
  try {
    const room = await VoiceRoom.findOne({
      where: { id: room_id },
    });
    if (!room) {
      throw Error("La sala no existe");
    }
    await room.update({
      room_status: "closed",
    });
  } catch (error) {}
};

export const isMoreThan10Minutes = async (user_id, room_id) => {
  try {
    let host = await VoiceRoom.findOne({ where: { id: room_id } });

    let existsValoration = await existsValorationMe(
      user_id,
      room_id,
      host.host_user_id
    );

    if (!existsValoration) {
      let more = await getUserTotalTimeInRooms(user_id, room_id);
      if (more > 10) {
        return true;
      } else {
        return false;
      }
    } else {
      false;
    }
  } catch (error) {}
};

const existsValorationMe = async (user_id, room_id, host_user_id) => {
  let valoration = await RoomRating.findOne({
    where: {
      user_id,
      room_id,
      host_user_id,
    },
  });
  if (!valoration) {
    return false;
  }
  return true;
};

// export const addValorationRoom = async (room_id, rating, user_id) => {
//   try {
//     let host = await VoiceRoom.findOne({
//       where: { id: room_id },
//     });

//     let valoration = await RoomRating.findOne({
//       where: {
//         user_id,
//         room_id,
//         host_user_id: host.host_user_id,
//       },
//     });
//     if (!valoration) {
//       let addValoration = await RoomRating.create({
//         room_id,
//         host_user_id: host.host_user_id,
//         rating,
//         user_id,
//       });

//       let tableRatingComplete = await UserHostRanking.findOne({
//         where: {
//           user_id: host.host_user_id
//         }
//       })

//       if(!tableRatingComplete){
//         tableRatingComplete = await UserHostRanking.create({
//           user_id: host.host_user_id
//         })
//       }

//       await tableRatingComplete.update({
//         total_ratings: total_ratings + 1,
//       })

//       await tableRatingComplete.update({
//         average_rating: tableRatingComplete.total_ratings /
//       })
//     }
//     return true;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const addValorationRoom = async (room_id, rating, user_id) => {
  try {
    // Encontrar la sala y obtener al host
    let host = await VoiceRoom.findOne({
      where: { id: room_id },
    });

    if (!host) {
      throw new Error("La sala de voz no existe.");
    }

    let host_user_id = host.host_user_id;

    // Verificar si ya existe una valoración
    let valoration = await RoomRating.findOne({
      where: {
        user_id,
        room_id,
        host_user_id,
      },
    });

    if (valoration) {
      return false; // Ya existe una valoración
    }

    // Crear una nueva valoración
    await RoomRating.create({
      room_id,
      host_user_id,
      rating,
      user_id,
    });

    // Verificar si existe el registro en UserHostRanking
    let userHostRanking = await UserHostRanking.findOne({
      where: { user_id: host_user_id },
    });

    if (!userHostRanking) {
      // Si no existe, se crea un registro nuevo
      userHostRanking = await UserHostRanking.create({
        user_id: host_user_id,
        average_rating: rating,
        total_ratings: 1,
      });
    } else {
      // Actualizar total_ratings y recalcular el average_rating
      const newTotalRatings = userHostRanking.total_ratings + 1;
      const newAverageRating =
        (userHostRanking.average_rating * userHostRanking.total_ratings +
          rating) /
        newTotalRatings;

      await userHostRanking.update({
        total_ratings: newTotalRatings,
        average_rating: newAverageRating,
      });
    }

    return true; // Valoración añadida exitosamente
  } catch (error) {
    console.error("Error al añadir valoración:", error);
    return false;
  }
};

async function getUserTotalTimeInRooms(user_id, room_id) {
  const logs = await RoomLog.findAll({
    where: {
      user_id,
      room_id,
      left_at: { [Op.ne]: null }, // Asegurarse de que left_at no sea null
    },
  });

  let totalTimeInMinutes = 0;

  logs.forEach((log) => {
    // Calcula la diferencia entre joined_at y left_at
    const joinedAt = new Date(log.joined_at);
    const leftAt = new Date(log.left_at);
    const timeInMinutes = (leftAt - joinedAt) / 1000 / 60; // Convierte a minutos
    totalTimeInMinutes += timeInMinutes;
  });

  return totalTimeInMinutes;
}
