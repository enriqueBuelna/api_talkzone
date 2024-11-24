import {
  addMemberUser,
  getAllMemberUsers,
  userLeft,
  changeInStage,
  closeVoiceRoom,
  isMoreThan10Minutes,
} from "../services/voice_room.service.js";
import { users } from "./principalSocket.socket.js";
const roomHosts = {}; // { room_id: user_id del host }
export const voiceRoomSocket = (socket, io) => {
  //admin siempre va estar en la primera posicion
  socket.on("joinRoom", async (payload) => {
    socket.join(payload.room_id);
    let newUser = await addMemberUser(payload.room_id, payload.user_id);
    if (newUser.dataValues.type === "host") {
      roomHosts[payload.room_id] = payload.user_id; // Guarda el `user_id` del host
    }
    socket.emit("myUserVoiceRoom", newUser);
    io.to(payload.room_id).emit("newUserVoiceRoom", newUser);
  });

  socket.on("raiseHand", (payload) => {
    const { room_id, user_id } = payload;
    console.log(room_id, user_id);
    // Obtener el `user_id` del host en esta sala
    const hostUserId = roomHosts[room_id];
    const hostSocketId = users[hostUserId];

    // // Verificar si el host está en línea y enviar la solicitud solo al host
    if (hostSocketId) {
      io.to(hostSocketId).emit("handRaised", user_id);
    } else {
      console.log("El host no está disponible o no está en línea");
    }
  });

  socket.on("answerRaiseHand", async (payload) => {
    //esto puede generar problemas, pero no necesariamente
    const { answer, user_id, room_id } = payload;
    let response = {
      answer,
      user_id,
    };
    let option;
    if (answer === "yes") {
      option = true;
    } else {
      option = false;
    }

    await changeInStage(option, room_id, user_id);
    io.to(payload.room_id).emit("responseHandRaised", response);
  });

  socket.on("userLeftStage", async (payload) => {
    const { room_id, user_id } = payload;

    let response = {
      user_id,
    };
    await changeInStage(false, room_id, user_id);
    io.to(payload.room_id).emit("userLeftStageComplete", response);
  });

  // Salir de una sala
  socket.on("leaveRoom", async (payload) => {
    await userLeft(payload.room_id, payload.user_id, payload.roomLogId);
    //verificar si ya cumpli con los 5 minutos de estar ahi, si si, le mando un true, si no, un false
    socket.emit("imWent", await isMoreThan10Minutes(payload.user_id, payload.room_id));
    io.to(payload.room_id).emit("userLeft", payload.user_id);
    if (roomHosts[payload.room_id] === payload.user_id) {
      await closeVoiceRoom(payload.room_id);
      console.log("ahuevo");
      io.to(payload.room_id).emit("voiceRoomClosed", "cerrado");
      delete roomHosts[payload.room_id];
      //aqui cerrar la sala y emitir a los que siguen en la sala que se cerro
    }
    socket.leave(payload.room_id);
  });

  
};

///lo que me medi cuenta es que se desconecta la sala sola, no se usa el ngOnDestroy, ocupo emitir el leftRoom
