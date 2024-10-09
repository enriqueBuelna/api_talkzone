import { userGetIn } from "./user.socket.js";
import { changeOnline } from "../services/users.services.js";
import { messagesSocket } from "./message.socket.js";

export const users = {};

export const registerSocketEvents = (io) => {
  io.on("connection", (socket) => {
    userGetIn(socket);

    messagesSocket(socket, io);

    socket.on("disconnect", async () => {
      for (const user in users) {
        if (users[user] === socket.id) {
          await changeOnline(user, 'offline');
          delete users[user];
          break;
        }
      }
      console.log("Cliente desconectado");
    });
  });
};