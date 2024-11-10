import { VoiceRoomMember } from "../models/voice_room_member.model.js";
import { User } from "../models/user.model.js";
import {
  addMemberUser,
  getAllMemberUsers,
} from "../services/voice_room.service.js";

export const createVoiceRoomMember = async (req, res) => {
  const { room_id, user_id } = req.body;

  try {
    // Validar que se han proporcionado los campos requeridos
    if (!room_id || !user_id) {
      return res
        .status(400)
        .json({ error: "room_id y user_id son requeridos" });
    }

    // Crear el miembro de la sala de voz
    const newMember = await addMemberUser(room_id, user_id);

    return res.status(201).json(newMember);
  } catch (error) {
    console.error("Error al agregar el miembro a la sala de voz:", error);
    return res
      .status(500)
      .json({ error: "Error al agregar el miembro a la sala de voz" });
  }
};

export const getAllVoiceRoomMembers = async (req, res) => {
  const { room_id } = req.query;

  try {
    // Validar que se ha proporcionado el room_id
    if (!room_id) {
      return res.status(400).json({ error: "El room_id es requerido" });
    }

    // Buscar todos los miembros de la sala de voz
    let members = await getAllMemberUsers(room_id);

    return res.status(200).json(members);
  } catch (error) {
    console.error("Error al obtener los miembros de la sala de voz:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener los miembros de la sala de voz" });
  }
};
