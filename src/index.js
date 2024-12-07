import express from "express";
import { Server } from "socket.io";
import { config } from "dotenv";
import { createServer } from "node:http";
import sequelize from "../db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { registerSocketEvents } from "./sockets/principalSocket.socket.js";

config();
// import userRoutes from "./routes/users.routes.js";
import usuarioRoutes from "./routes/users.routes.js";
import topicRoutes from "./routes/topics.routes.js";
import postRoutes from "./routes/posts.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import vrRoutes from "./routes/voice_rooms.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import tags from "./routes/tags.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import followersRoutes from "./routes/followers.routes.js";
import communitiesRoutes from "./routes/communitie.routes.js";
import cmRoutes from "./routes/communtie_members.routes.js";
import userPreferences from "./routes/user_preferences.routes.js";
import postTags from "./routes/post_tags.routes.js";
import moderationReport from "./routes/moderation_reports.routes.js";
import userPreferencesTag from "./routes/user_preferences_tags.routes.js";
import matchmakingConnect from "./routes/mm_user_connect.routes.js";
import vrMembersRoutes from "./routes/voice_room_member.routes.js";
import adminRoutes from "./routes/admin.routes.js";
// import emailVerify from "./routes/verification_email.routes.js";
// import indexRoutes from "./routes/index.routes.js";

const app = express();
const PORT = process.env.PORT;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"], // URL de tu frontend
    // origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

registerSocketEvents(io);

// io.on("connection", (socket) => {
//   console.log("cliente conectado");

//   socket.on("disconnect", () => {
//     console.log("Cliente desconectado");
//   });
// });

//middlewares

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// app.use(indexRoutes);
// app.use(userRoutes);
app.use(usuarioRoutes);
app.use(topicRoutes);
app.use(postRoutes);
app.use(messageRoutes);
app.use(vrRoutes);
app.use(likesRoutes);
app.use(notificationRoutes);
app.use(commentRoutes);
app.use(followersRoutes);
app.use(communitiesRoutes);
app.use(cmRoutes);
app.use(userPreferences);
app.use(postTags);
app.use(moderationReport);
app.use(userPreferencesTag);
app.use(tags);
app.use(matchmakingConnect);
app.use(vrMembersRoutes);
app.use(adminRoutes);
// app.use(emailVerify);

app.use((req, res, next) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});

//cambio aqui

// Maneja las conexiones de Socket.io
console.time("Sincronización Sequelize");
sequelize
  .sync({ force: false})
  .then(() => {
    console.timeEnd("Sincronización Sequelize");
    console.log(
      "Conexión a la base de datos establecida y tablas sincronizadas"
    );
    // Aquí puedes iniciar el servidor
    server.listen(PORT, () => {
      console.log(`Server iniciado en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });
console.log("Hola");
