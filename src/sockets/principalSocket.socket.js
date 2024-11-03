import { userGetIn } from "./user.socket.js";
import { changeOnline } from "../services/users.services.js";
import { messagesSocket } from "./message.socket.js";

export const users = {};

export const registerSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("conection");
    userGetIn(socket);

    messagesSocket(socket, io);

    socket.on("disconnect", async () => {
      
      const user = Object.keys(users).find((user) => users[user] === socket.id);

      if (user) {
        await changeOnline(user, "offline");
        delete users[user];
      }
      console.log("Cliente desconectado");
    });
  });
};
