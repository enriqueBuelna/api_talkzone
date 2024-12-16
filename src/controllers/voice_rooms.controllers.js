import { BlockedRoomUser } from "../models/blocked_room_user.model.js";
import { VoiceRoom } from "../models/voice_rooms.models.js";
import { ListInvites } from "../models/list_invites.model.js";
import {
  createVoiceRoomService,
  getVoiceRoomByIdService,
  getVoiceRooms,
  closeVoiceRoom,
  verifyStatuss,
  addValorationRoom,
  createVoiceRoomPrivateService,
} from "../services/voice_room.service.js";
import { inviteVoiceRoom } from "../services/messages.services.js";
import { BlockedUsers } from "../models/blocked_users.model.js";
// Controlador para crear una sala de voz

export const inviteMessageService = async (req, res) => {
  const { sender_id, receiver_id, room_id } = req.body;
  try {
    let invite = await inviteVoiceRoom(sender_id, receiver_id, room_id);
    return res.status(201).json(invite);
  } catch (error) {
    console.log(error);
  }
};

export const createVoiceRoomPrivate = async (req, res) => {
  const { room_name, host_user_id, topic_id, type, tags } = req.body;
  try {
    const newVoiceRoom = await createVoiceRoomPrivateService(
      room_name,
      topic_id,
      host_user_id,
      type
    );

    return res.status(201).json(newVoiceRoom);
  } catch (error) {
    console.error("Error al crear la sala de voz:", error);
    return res.status(500).json({ error: "Error al crear la sala de voz" });
  }
};

export const createVoiceRoom = async (req, res) => {
  const { room_name, host_user_id, topic_id, type, tags } = req.body;

  try {
    // Validar que se han proporcionado los campos requeridos
    const newVoiceRoom = await createVoiceRoomService(
      room_name,
      topic_id,
      host_user_id,
      tags,
      type
    );

    return res.status(201).json(newVoiceRoom);
  } catch (error) {
    console.error("Error al crear la sala de voz:", error);
    return res.status(500).json({ error: "Error al crear la sala de voz" });
  }
};

export const addRating = async (req, res) => {
  let { room_id, user_id, rating } = req.body;
  try {
    let result = await addValorationRoom(room_id, rating, user_id);
    res.status(201).json(result);
  } catch (error) {}
};

export const verifyStatus = async (req, res) => {
  const { room_id, user_id } = req.query;
  try {
    const result = await verifyStatuss(room_id);
    let blockedUserIds = await userBlockByMe(user_id);

    for (const el of blockedUserIds) {
      if (el == result.host_user_id) {
        return res.status(201).json('no-invite');
      }
    }
    if (result.is_private) {
      let isThere = await ListInvites.findOne({
        where: {
          room_id,
          user_id,
        },
      });

      if (isThere === null) {
        let aux = "no-invite";
        return res.status(201).json(aux);
      }
    }

    if (result) {
      let aux = result.room_status === "closed" ? "closed" : "open";
      const result2 = await BlockedRoomUser.findOne({
        where: {
          room_id,
          user_id,
        },
      });

      if (result2) {
        aux = "deleted";
      }
      return res.status(201).json(aux);
    }
    return res.status(404).json("chivo");
  } catch (error) {
    console.log(error);
  }
};

export const updateVoiceRoom = async (req, res) => {
  const { room_name, room_status, topic_id } = req.body;
  const { room_id } = req.params;

  try {
    // Verificar que se ha proporcionado un room_id
    if (!room_id) {
      return res.status(400).json({ error: "El room_id es requerido" });
    }

    // Buscar la sala de voz
    const voiceRoom = await VoiceRoom.findByPk(room_id);

    // Verificar si la sala de voz existe
    if (!voiceRoom) {
      return res.status(404).json({ error: "Sala de voz no encontrada" });
    }

    // Actualizar los campos que se han enviado en el cuerpo de la solicitud
    if (room_name) voiceRoom.room_name = room_name;
    if (room_status) voiceRoom.room_status = room_status;
    if (topic_id) voiceRoom.topic_id = topic_id;

    // Guardar los cambios
    await voiceRoom.save();

    return res.status(200).json(voiceRoom);
  } catch (error) {
    console.error("Error al actualizar la sala de voz:", error);
    return res
      .status(500)
      .json({ error: "Error al actualizar la sala de voz" });
  }
};

export const getVoiceRoom = async (req, res) => {
  const { room_id } = req.params;

  try {
    // Verificar que se ha proporcionado un room_id
    if (!room_id) {
      return res.status(400).json({ error: "El room_id es requerido" });
    }

    // Buscar la sala de voz
    const voiceRoom = await VoiceRoom.findByPk(room_id, {
      include: [
        { model: User, as: "host_user" }, // Incluye los detalles del usuario que es el host
        { model: Topic }, // Incluye los detalles del tema asociado
      ],
    });

    // Verificar si la sala de voz existe
    if (!voiceRoom) {
      return res.status(404).json({ error: "Sala de voz no encontrada" });
    }

    return res.status(200).json(voiceRoom);
  } catch (error) {
    console.error("Error al obtener la sala de voz:", error);
    return res.status(500).json({ error: "Error al obtener la sala de voz" });
  }
};

export const getVoiceRoomById = async (req, res) => {
  let { room_id, user_id } = req.params;
  try {
    let results = await getVoiceRoomByIdService(room_id, user_id);
    res.status(201).json(results);
  } catch (error) {
    console.error("Error al obtener la sala de voz:", error);
    return res.status(500).json({ error: "Error al obtener la sala de voz" });
  }
};

export const deleteVoiceRoom = async (req, res) => {
  const { room_id } = req.params;

  try {
    // Verificar que se ha proporcionado un room_id
    if (!room_id) {
      return res.status(400).json({ error: "El room_id es requerido" });
    }

    // Buscar la sala de voz
    const voiceRoom = await VoiceRoom.findByPk(room_id);

    // Verificar si la sala de voz existe
    if (!voiceRoom) {
      return res.status(404).json({ error: "Sala de voz no encontrada" });
    }

    // Eliminar la sala de voz
    await voiceRoom.destroy();

    return res
      .status(200)
      .json({ message: "Sala de voz eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la sala de voz:", error);
    return res.status(500).json({ error: "Error al eliminar la sala de voz" });
  }
};

export const getVoiceRoomsByPreferences = async (req, res) => {
  try {
    const { user_id, filter, page } = req.body;
    const results = await getVoiceRooms(user_id, filter, page);
    return res.status(201).json(results);
  } catch (error) {
    console.log(error);
  }
};

export const closeVoiceRoomm = async (req, res) => {
  try {
    const { room_id } = req.body;
    const room = await closeVoiceRoom(room_id);
    return res.status(201).json(room);
  } catch (error) {
    console.log("A");
  }
};

const userBlockByMe = async (user_id) => {
  const blockedByMe = await BlockedUsers.findAll({
    where: { blocker_user_id: user_id },
    attributes: ["blocked_user_id"],
  });
  const blockedMe = await BlockedUsers.findAll({
    where: { blocked_user_id: user_id },
    attributes: ["blocker_user_id"],
  });
  
  // Listas de usuarios bloqueados en ambas direcciones
  const blockedByMeIds = blockedByMe.map((entry) => entry.blocked_user_id);
  const blockedMeIds = blockedMe.map((entry) => entry.blocker_user_id);
  
  // Combina ambas listas de usuarios bloqueados
  return [...new Set([...blockedByMeIds, ...blockedMeIds])];
}