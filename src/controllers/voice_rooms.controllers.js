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
    return res.status(500).json({ error: "Error al actualizar la sala de voz" });
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
        { model: User, as: 'host_user' }, // Incluye los detalles del usuario que es el host
        { model: Topic },                 // Incluye los detalles del tema asociado
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

    return res.status(200).json({ message: "Sala de voz eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la sala de voz:", error);
    return res.status(500).json({ error: "Error al eliminar la sala de voz" });
  }
};
