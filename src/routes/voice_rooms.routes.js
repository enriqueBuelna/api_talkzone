import { Router } from "express";

import { addRating, closeVoiceRoomm, createVoiceRoom, getVoiceRoomById, getVoiceRoomsByPreferences, verifyStatus, createVoiceRoomPrivate, inviteMessageService } from "../controllers/voice_rooms.controllers.js";

const router = Router();

router.post("/voice_rooms/createVoiceroom", createVoiceRoom);
router.get("/voice_rooms/getVoiceroomById/:room_id", getVoiceRoomById);
router.post("/voice_rooms/getVoiceRooms", getVoiceRoomsByPreferences);
router.post("/voice_rooms/closeVoiceRoom", closeVoiceRoomm);
router.get("/voice_rooms/verifyStatus", verifyStatus);
router.post("/voice_rooms/addRating", addRating);
router.post("/voice_rooms/createVoiceRoomPrivate", createVoiceRoomPrivate);
router.post("/voice_rooms/inviteMessage", inviteMessageService);
export default router;