import { getFollowing } from "../services/followers.services.js";
import { changeOnline } from "../services/users.services.js";
import { users } from "./principalSocket.socket.js";  // Importar el objeto `users`

export const userGetIn = (socket) => {
  socket.on("getUsers", async (id_username) => {
    // Asignar el id del usuario al objeto `users`
    users[id_username] = socket.id;  // Guardar el id del usuario con su socket.id
    
    //aqui podria hacer un endpoint para decir que si estoy online
    await changeOnline(id_username, 'online');
    
    //obtener a mis amigos
    socket.emit("createUserMessage", await getFollowing(id_username));

  });
};