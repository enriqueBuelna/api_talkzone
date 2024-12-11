import { ModerationReport } from "../models/moderation_report.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.models.js";
import { VoiceRoom } from "../models/voice_rooms.models.js";
import { Message } from "../models/message.models.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { PostTag } from "../models/post_tag.model.js";
import { Tag } from "../models/tag.models.js";
import { Topic } from "../models/topic.models.js";
import { VoiceRoomTag } from "../models/voice_room_tag.model.js";
import { Comment } from "../models/comment.model.js";
export const createModerationReport = async (req, res) => {
  const {
    reporter_id,
    reported_user_id,
    post_id,
    comment_id,
    room_id,
    message_id,
    reason,
  } = req.body;

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

    res.status(201).json({
      message: "Moderation report created successfully",
      report: newReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating moderation report",
      error: error.message,
    });
  }
};

// Obtener todos los informes de moderación
export const getAllModerationReports = async (req, res) => {
  try {
    const reports = await ModerationReport.findAll({
      include: [
        {
          model: User,
          as: "reporter",
          attributes: ["id", "username"], // Ajusta los atributos según tu modelo
        },
        {
          model: User,
          as: "reported",
          attributes: ["id", "username"], // Ajusta los atributos según tu modelo
        },
        {
          model: Post,
          as: "reportedPost",
          attributes: ["id", "content"], // Incluye el ID para identificarlo
        },
        {
          model: Comment,
          as: "reportedComment",
          attributes: ["id", "content"], // Incluye el ID para identificarlo
        },
        {
          model: VoiceRoom,
          as: "reportedRoom",
          attributes: ["id", "room_name"], // Incluye el ID para identificarlo
        },
        {
          model: Message,
          as: "reportedMessage",
          attributes: ["id", "content"], // Incluye el ID para identificarlo
        },
      ],
    });

    // Procesar los resultados para agregar el tipo
    const formattedReports = reports.map((report) => {
      let type = null;
      if (report.post_id) type = "post";
      else if (report.comment_id) type = "comment";
      else if (report.room_id) type = "room";
      else if (report.message_id) type = "message";

      return {
        ...report.toJSON(),
        type, // Agregar el tipo al objeto
      };
    });

    res.status(200).json(formattedReports);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching moderation reports",
      error: error.message,
    });
  }
};

export const getModerationReportById = async (req, res) => {
  const { id } = req.query;
  try {
    const report = await ModerationReport.findByPk(id);
    let type = "";
    if (report.post_id) {
      type = "post";
    } else if (report.comment_id) {
      type = "comment";
    } else if (report.message_id) {
      type = "message";
    } else if (report.room_id) {
      type = "room";
    } else {
      type = "remove";
    }
    let response;
    if (report.status == "resolved" && report.result == "Contenido borrado") {
      response = {
        type,
        action: "Contenido borrado",
      };
      return res.status(201).json(response);
    } else if (
      report.status == "resolved" &&
      report.result == "Advertencia enviada"
    ) {
      response = await Post.findOne({
        where: {
          id: report.post_id,
        },
        include: [
          {
            model: User,
            as: "post_user",
            attributes: [
              "id",
              "username",
              "gender",
              "profile_picture",
              "is_verified",
            ],
          },
          {
            model: UserPreference,
            as: "post_user_preference",
            include: [
              {
                model: Topic,
                attributes: ["topic_name"],
              },
            ],
            attributes: ["topic_id", "type"],
          },
          {
            model: PostTag, // Include associated tags
            as: "post_tagss",
            include: [
              {
                model: Tag,
                as: "post_tag_tag",
                attributes: ["id", "tag_name", "topic_id"],
              },
            ],
            attributes: ["id"],
          },
        ],
      });
      response.setDataValue("type", 'ostia');
      response.setDataValue("action", "Advertencia enviada");
      return res.status(201).json(response);
    } else {
      console.log("CVI");
      if (type === "post") {
        response = await Post.findOne({
          where: {
            id: report.post_id,
          },
          include: [
            {
              model: User,
              as: "post_user",
              attributes: [
                "id",
                "username",
                "gender",
                "profile_picture",
                "is_verified",
              ],
            },
            {
              model: UserPreference,
              as: "post_user_preference",
              include: [
                {
                  model: Topic,
                  attributes: ["topic_name"],
                },
              ],
              attributes: ["topic_id", "type"],
            },
            {
              model: PostTag, // Include associated tags
              as: "post_tagss",
              include: [
                {
                  model: Tag,
                  as: "post_tag_tag",
                  attributes: ["id", "tag_name", "topic_id"],
                },
              ],
              attributes: ["id"],
            },
          ],
        });
      } else if (type === "comment") {
        response = await Comment.findOne({
          where: {
            id: report.comment_id,
          },
          include: [
            {
              model: User,
              as: "userss",
              attributes: [
                "id",
                "username",
                "gender",
                "profile_picture",
                "is_verified",
              ],
            },
          ],
        });
      } else if (type === "message") {
        response = await Message.findOne({
          where: {
            id: report.message_id,
            sender_id: report.reported_user_id,
            receiver_id: report.reporter_id,
          },
          include: [
            {
              model: User,
              as: "senderUserMessage",
              attributes: ["id", "username", "gender", "profile_picture"],
            },
          ],
        });
      } else if (type === "room") {
        response = await VoiceRoom.findOne({
          where: {
            id: report.room_id,
          },
          include: [
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
            {
              model: User,
              as: "host_user",
              attributes: ["username", "profile_picture", "id"],
            },
          ],
        });
      }
    }

    response.setDataValue("type", type);
    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};
