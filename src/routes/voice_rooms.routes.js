import { Router } from "express";

import { createVoiceRoom, getVoiceRoomById, getVoiceRoomsByPreferences } from "../controllers/voice_rooms.controllers.js";

const router = Router();

router.post("/voice_rooms/createVoiceroom", createVoiceRoom);
router.get("/voice_rooms/getVoiceroomById/:room_id", getVoiceRoomById);
router.get("/voice_rooms/getVoiceRooms", getVoiceRoomsByPreferences);
export default router;