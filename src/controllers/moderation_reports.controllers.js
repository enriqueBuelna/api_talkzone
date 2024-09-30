import { ModerationReport } from "../models/moderation_report.model.js";
import { User } from "../models/usuario.model.js";

export const createModerationReport = async (req, res) => {
    const { reporter_id, reported_user_id, post_id, comment_id, room_id, message_id, reason } = req.body;
  
    try {
      const newReport = await ModerationReport.create({
        reporter_id,
        reported_user_id,
        post_id,
        comment_id,
        room_id,
        message_id,
        reason,
      });
  
      res.status(201).json({ message: 'Moderation report created successfully', report: newReport });
    } catch (error) {
      res.status(500).json({ message: 'Error creating moderation report', error: error.message });
    }
  };
  
  // Obtener todos los informes de moderación
  export const getAllModerationReports = async (req, res) => {
    try {
      const reports = await ModerationReport.findAll({
        include: [
          {
            model: User,
            as: 'reporter',
            attributes: ['id', 'username'], // Ajusta los atributos según tu modelo
          },
          {
            model: User,
            as: 'reportedUser',
            attributes: ['id', 'username'], // Ajusta los atributos según tu modelo
          },
        ],
      });
  
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching moderation reports', error: error.message });
    }
  };