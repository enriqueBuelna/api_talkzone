import {
  createMessage,
  getMessagesBetweenUsers,
} from "../services/messages.services.js";
import { users } from "./principalSocket.socket.js";

export const messagesSocket = async (socket, io) => {
  socket.on("sendMessage", async (message) => {
    try {
      let { sender_id, receiver_id, content, media_url } = message;
      let newMessage = await createMessage(
        sender_id,
        receiver_id,
        content,
        null
      );


      const allSocketIds = [
        ...(users[sender_id] || []),
        ...(users[receiver_id] || []),
      ];

      // Emitir el mensaje a todas las conexiones
      for (const id of allSocketIds) {
        io.to(id).emit("chatMessage", newMessage);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  });

  socket.on("getMessages", async (sender_id, receiver_id) => {
    try {
      const messages = await getMessagesBetweenUsers(sender_id, receiver_id);
      socket.emit("retrieveMessages", messages);
    } catch (error) {}
  });
};
