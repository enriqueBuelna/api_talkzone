import { getFollowing } from "../services/followers.services.js";
import { changeOnline } from "../services/users.services.js";
import { users } from "./principalSocket.socket.js"; // Importar el objeto `users`
export const userGetIn = (socket) => {
  socket.on("getUsers", async (id_username) => {
    // Asignar el id del usuario al objeto `users`
    // console.log(id_username);
    // if (!users[id_username]) {
    //   users[id_username] = []; // Inicializa el array si no existe
    // }

    // users[id_username].push(socket.id); // Agrega el socket.id al array
    // if (users[id_username] && users[id_username].length > 0) {
    //   // Si hay una conexión previa, desconéctala
    //   const previousSocketId = users[id_username][0];
    //   io.to(previousSocketId).emit("forceDisconnect"); // Envía un evento para forzar la desconexión del socket anterior
    //   users[id_username] = []; // Limpia el array para esta nueva conexión
    // }
  
    // Asigna el nuevo socket.id a la conexión del usuario
    users[id_username] = [socket.id];
    console.log("En getusers ",users);
    //aqui podria hacer un endpoint para decir que si estoy online
    await changeOnline(id_username, "online");
  });
};