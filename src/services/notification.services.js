import { Notification } from "../models/notification.model.js";
export const createNotification = async (
  sender_id,
  receiver_id,
  type,
  related_post_id,
  related_comment_id,
  related_message_id,
  related_like_id,
  related_room_open_id
) => {
  try {
    const notification = await Notification.create({
      sender_id,
      receiver_id,
      type,
      related_post_id,
      related_comment_id,
      related_message_id,
      related_like_id,
      related_room_open_id,
    });
  } catch (error) {
    console.log("ERROR", error);
  }
};
