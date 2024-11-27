import { Message } from "../models/message.models.js";
import { Op } from "sequelize";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { getBasicInfoo } from "./users.services.js";

export const readMessages = async (user_id, user_id_2) => {
  try {
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { user1: user_id, user2: user_id_2 },
          { user1: user_id_2, user2: user_id },
        ],
      },
    });

    await Message.update(
      { is_read: true }, // Valores a actualizar
      {
        where: {
          conversation_id: chat.id,
          sender_id: user_id_2,
          is_read: false,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const readMessageLive = async (payload) => {
  const { id } = payload;
  await Message.update(
    { is_read: true }, // Valores a actualizar
    {
      where: {
        id,
        is_read: false,
      },
    }
  );
};

export const createMessage = async (
  sender_id,
  receiver_id,
  content,
  media_url
) => {
  // Crear el mensaje
  // const newMessage = await Message.create({
  //   sender_id,
  //   receiver_id,
  //   content: content || null, // Permitir que el contenido sea opcional
  //   media_url: media_url || null, // Permitir que la URL del medio sea opcional
  // });

  // return newMessage;
  let noExisteChat = false;
  // Verifica si el chat existe
  let chat = await Chat.findOne({
    where: {
      [Op.or]: [
        { user1: sender_id, user2: receiver_id },
        { user1: receiver_id, user2: sender_id },
      ],
    },
  });

  // Si no existe, crea uno nuevo
  if (!chat) {
    noExisteChat = true;
    chat = await Chat.create({
      user1: sender_id,
      user2: receiver_id,
      last_message: null, // se actualizará después
    });
  }

  // Ahora tenemos el ID de chat, ya sea existente o recién creado
  const chatId = chat.id;

  // Inserta el mensaje con el chatId correspondiente
  const newMessage = await Message.create({
    sender_id,
    receiver_id,
    content,
    conversation_id: chatId, // Ahora se usa el ID de la conversación
    media_url: media_url || null,
  });

  // Actualiza el último mensaje en la tabla `Chat`
  chat.last_message = newMessage.id;
  await chat.save();

  let userBasicInfo, userBasicInfo2;
  if (noExisteChat) {
    //movi aqui
    userBasicInfo2 = await getBasicInfoo(sender_id);
    userBasicInfo = await getBasicInfoo(receiver_id);
  }
  console.log(userBasicInfo);
  return [newMessage, chat, userBasicInfo, userBasicInfo2];
};

export const getMessagesBetweenUsers = async (sender_id, receiver_id) => {
  try {
    console.log(receiver_id);
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: sender_id, receiver_id: receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
      attributes: ["content", "sent_at", "sender_id"], // Seleccionar solo content y sent_at
      order: [["sent_at", "ASC"]], // Ordenar por fecha de envío
      raw: true,
    });

    // const unreadMessagesCount = await Message.count({
    //   where: {
    //     receiver_id,
    //     is_read: false,
    //     // conversation_id: conversationId, // Opcional, si necesitas filtrar por una conversación específica.
    //   },
    // });

    // console.log(unreadMessagesCount);

    return messages;
  } catch (error) {
    console.error("Error al obtener los mensajes entre usuarios:", error);
    throw new Error("Error al obtener los mensajes");
  }
};

export const getMyConversation = async (user_id) => {
  try {
    let conversations = await Chat.findAll({
      where: {
        [Op.or]: [{ user1: user_id }, { user2: user_id }],
      },
      include: [
        {
          model: Message,
        },
        {
          model: User,
          as: "user_chat",
          attributes: ["id", "username", "profile_picture"],
        },
        {
          model: User,
          as: "user_chat_1",
          attributes: ["id", "username", "profile_picture"],
        },
      ],
    });

    // Mapear y transformar las conversaciones
    let conversationData = await Promise.all(
      conversations.map(async (conversation) => {
        let convo = conversation.toJSON(); // Convertir cada conversación a JSON

        // Determinar el otro usuario en la conversación
        convo.other_user =
          convo.user1 === user_id ? convo.user_chat_1 : convo.user_chat;

        // Contar los mensajes no leídos
        const otherUserId = convo.user1 === user_id ? convo.user2 : convo.user1;
        const unreadCount = await Message.count({
          where: {
            conversation_id: convo.id,
            receiver_id: user_id,
            sender_id: otherUserId,
            is_read: false,
          },
        });

        // Añadir el conteo de mensajes no leídos a la conversación
        convo.unread_count = unreadCount;

        // Eliminar las propiedades originales para evitar duplicados
        delete convo.user_chat;
        delete convo.user_chat_1;

        return convo;
      })
    );

    console.log(conversationData);
    return conversationData;
  } catch (error) {
    console.error("Error obteniendo las conversaciones: ", error);
    throw error; // Lanza el error para manejarlo en un controlador
  }
};
