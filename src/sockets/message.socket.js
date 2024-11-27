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
  
      // Crea el mensaje en la base de datos o donde corresponda
      const newMessage = await createMessage(sender_id, receiver_id, content, media_url);
  
      // Obtén los socket IDs de los usuarios remitente y destinatario
      const senderSocketId = users[sender_id] ? users[sender_id][0] : null;
      const receiverSocketId = users[receiver_id] ? users[receiver_id][0] : null;
  
      // Emitir el mensaje al remitente y destinatario si están conectados
      if (senderSocketId) io.to(senderSocketId).emit("chatMessage", newMessage);
      if (receiverSocketId && receiverSocketId !== senderSocketId) {
        io.to(receiverSocketId).emit("chatMessage", newMessage);
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
