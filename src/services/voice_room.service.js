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

export const verifyStatuss = async (room_id) => {
  try {
    const exists = await VoiceRoom.findByPk(room_id);
    return exists;
  } catch (error) {
    console.log(error)
  }
}

export const createVoiceRoomService = async (
  room_name,
  topic_id,
  host_user_id,
  tags
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
    });
    await VoiceRoomMember.create({
      room_id: voice_room.id,
      user_id: host_user_id,
      joined_at: new Date(),
      left_at: null,
      type: "host",
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

export const getVoiceRooms = async (user_id) => {
  try {
    //aqui va a ser un cambio
    let topics_ids = await getUserPreferencess(user_id);
    topics_ids = topics_ids.map((item) => item.topic_id);
    let rooms = await VoiceRoom.findAll({
      where: { topic_id: topics_ids, room_status: "active" },
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
        // Aquí incluyes la relación con el host_user
        {
          model: User,
          as: "host_user", // Asegúrate de que esto coincida con el alias de tu asociación
          attributes: ["username", "profile_picture", "id"], // Los atributos que quieres devolver
        },
      ],
      attributes: ["id", "room_name", "topic_id", "room_status"],
    });

    return rooms;
  } catch (error) {
    console.log(error);
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

    if (existingMember) {
      // Si el usuario ya está en la sala (left_at es null), no hacemos nada
      // if (existingMember.left_at === null) {
      //   throw new Error("El usuario ya está en la sala de voz.");
      // }

      let in_stage = false;
      if (host.host_user_id === user.id) {
        in_stage = true;
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
        console.log("HHHHHHHHHHHHHHHHHHHHHH");
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

export const userLeft = async (room_id, user_id) => {
  try {
    const member = await VoiceRoomMember.findOne({
      where: { room_id, user_id, left_at: null },
    });

    if (!member) {
      throw new Error("El usuario no está actualmente en la sala de voz.");
    }

    // Actualizamos el campo left_at con la hora de salida
    await member.update({
      left_at: new Date(),
      in_stage: false,
    });
  } catch (error) {}
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
