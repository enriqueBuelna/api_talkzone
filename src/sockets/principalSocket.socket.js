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

    // socket.on("disconnect", async () => {

    //   const user = Object.keys(users).find((user) => users[user] === socket.id);

    //   if (user) {
    //     await changeOnline(user, "offline");
    //     delete users[user];
    //   }
    //   console.log("Cliente desconectado");
    // });
    socket.on("disconnect", async () => {
      // Encuentra el usuario que tiene este socket.id en su array
      const user = Object.keys(users).find((user) =>
        users[user].includes(socket.id)
      );

      if (user) {
        // Elimina el socket.id del array de este usuario
        users[user] = users[user].filter((id) => id !== socket.id);

        // Si ya no quedan conexiones para este usuario, cámbialo a "offline" y elimina la entrada
        if (users[user].length === 0) {
          await changeOnline(user, "offline");
          delete users[user];
        }
      }

      console.log("Cliente desconectado");
    });

    socket.on("forceDisconnect", () => {
      socket.disconnect();
    });
  });
};
