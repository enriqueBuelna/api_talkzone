import { where } from "sequelize";
import { Topic } from "../models/topic.models.js";
import { User } from "../models/user.model.js";
import { VoiceRoom } from "../models/voice_rooms.models.js";
import { createVoiceRoomTag } from "./voice_room_tag.services.js";
import { VoiceRoomMember } from "../models/voice_room_member.model.js";
import { VoiceRoomTag } from "../models/voice_room_tag.model.js";
import { Tag } from "../models/tag.models.js";
import { getUserPreferencess } from "./users.services.js";

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
    let topics_ids = await getUserPreferencess(user_id);
    topics_ids = topics_ids.map((item) => item.topic_id);
    let rooms = await VoiceRoom.findAll({
      where: { topic_id: topics_ids },
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
          attributes:["id"]
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
          attributes:["tag_id"]
        },
        // Aquí incluyes la relación con el host_user
        {
          model: User,
          as: "host_user", // Asegúrate de que esto coincida con el alias de tu asociación
          attributes: ["username", "profile_picture", "id"], // Los atributos que quieres devolver
        },
      ],
      attributes:["id","room_name","topic_id"]
    });
    

    return rooms;
  } catch (error) {
    console.log(error);
  }
};
