import { userGetIn } from "./user.socket.js";
import { changeOnline } from "../services/users.services.js";
import { messagesSocket } from "./message.socket.js";
import { voiceRoomSocket } from "./voice_room.js";

export const users = {};

export const registerSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(users);
    console.log("conection uwwu");
    userGetIn(socket);

    messagesSocket(socket, io);
    voiceRoomSocket(socket, io);
    socket.on("disconnect", async () => {
      console.log("Cliente desconectado:", socket.id);
      // Lógica para eliminar el socket.id del usuario
      const user = Object.keys(users).find((u) => users[u].includes(socket.id));
      if (user) {
        users[user] = users[user].filter((id) => id !== socket.id);
        if (users[user].length === 0) {
          await changeOnline(user, "offline");
          delete users[user];
          console.log("Usuario desconectado:", user);
        }
      }
    });

    socket.on("forceDisconnect", () => {
      socket.disconnect();
    });
  });
};
