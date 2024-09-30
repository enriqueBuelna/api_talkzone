import { VoiceRoom } from "../models/voice_rooms.models.js";
// Controlador para crear una sala de voz
export const createVoiceRoom = async (req, res) => {
  const { room_name, host_user_id, topic_id } = req.body;

  try {
    // Validar que se han proporcionado los campos requeridos
    if (!room_name || !host_user_id || !topic_id) {
      return res
        .status(400)
        .json({ error: "room_name, host_user_id y topic_id son requeridos" });
    }

    // Crear la sala de voz
    const newVoiceRoom = await VoiceRoom.create({
      room_name,
      host_user_id,
      topic_id,
    });

    return res.status(201).json(newVoiceRoom);
  } catch (error) {
    console.error("Error al crear la sala de voz:", error);
    return res.status(500).json({ error: "Error al crear la sala de voz" });
  }
};
