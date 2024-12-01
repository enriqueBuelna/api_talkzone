import {
  createMessage,
  getMessagesBetweenUsers,
  readMessageLive,
  readMessages
} from "../services/messages.services.js";
import { users } from "./principalSocket.socket.js";

export const messagesSocket = async (socket, io) => {
  // socket.on("sendMessage", async (message) => {
  //   try {
  //     let { sender_id, receiver_id, content, media_url } = message;
  //     let newMessage = await createMessage(
  //       sender_id,
  //       receiver_id,
  //       content,
  //       null
  //     );


  //     const allSocketIds = [
  //       ...(users[sender_id] || []),
  //       ...(users[receiver_id] || []),
  //     ];

  //     // Emitir el mensaje a todas las conexiones
  //     for (const id of allSocketIds) {
  //       io.to(id).emit("chatMessage", newMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error al enviar mensaje:", error);
  //   }
  // });


  socket.on("readMessage", async (payload) => {
    const {id, sender_id, receiver_id, user_id, amHere} = payload;
    if(receiver_id === user_id && amHere){
      await readMessageLive(payload);
    }
  });

  socket.on("sendMessage", async (message) => {
    try {
      const { sender_id, receiver_id, content, media_url } = message;
  
      // Guarda el mensaje en la base de datos
      const newMessage = await createMessage(sender_id, receiver_id, content, media_url);
  
      // Obtén los socket IDs activos
      const senderSocketIds = users[sender_id] || [];
      const receiverSocketIds = users[receiver_id] || [];
  
      // Emitir mensaje al remitente
      if (senderSocketIds.length > 0) {
        senderSocketIds.forEach((socketId) => {
          io.to(socketId).emit("chatMessage", newMessage);
        });
      }
  
      // Emitir mensaje al receptor si es diferente del remitente
      if (receiverSocketIds.length > 0 && sender_id !== receiver_id) {
        receiverSocketIds.forEach((socketId) => {
          io.to(socketId).emit("chatMessage", newMessage);
        });
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  });

  socket.on("readMessages", async (payload) => {
    let {user_id, user_id_2} = payload;
    await readMessages(user_id, user_id_2);
  })

  socket.on("getMessages", async (sender_id, receiver_id) => {
    try {
      const messages = await getMessagesBetweenUsers(sender_id, receiver_id);
      socket.emit("retrieveMessages", messages);
    } catch (error) {}
  });
};
