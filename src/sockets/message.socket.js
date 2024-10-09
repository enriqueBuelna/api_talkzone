import {
  createMessage,
  getMessagesBetweenUsers,
} from "../services/messages.services.js";
import { users } from "./principalSocket.socket.js";

export const messagesSocket = async (socket, io) => {
  socket.on(
    "sendMessage",
    async (sender_id, receiver_id, content, media_url) => {
      try {
        await createMessage(sender_id, receiver_id, content, null);

        const receiverSocketId = users[receiver_id]; // Obtener el ID del socket del receptor

        // Emitir el mensaje al remitente
        socket.emit("chatMessage", content);

        // Emitir el mensaje al receptor
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("chatMessage", content);
        }
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      }
    }
  );

  socket.on("getMessages", async (sender_id, receiver_id) => {
    try {
      const messages = await getMessagesBetweenUsers(sender_id, receiver_id);
      socket.emit("retrieveMessages", messages);
    } catch (error) {}
  });
};
