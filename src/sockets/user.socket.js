import { changeOnline } from "../services/users.services.js";
import { users } from "./principalSocket.socket.js"; // Importar el objeto `users`
export const userGetIn = (socket) => {
  socket.on("getUsers", async (id_username) => {
    // Asigna el nuevo socket.id a la conexión del usuario
    users[id_username] = [socket.id];
    //aqui podria hacer un endpoint para decir que si estoy online
    await changeOnline(id_username, "online");
    //conseguir a las personas que sigo que estan online, okey?, y eso mandarlo al socket,y cuando alguien se salga, pues eso tambien, me explico?

    
  });
};