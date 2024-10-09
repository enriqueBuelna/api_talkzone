import { Router } from "express";

import { createVoiceRoomMember, getAllVoiceRoomMembers } from "../controllers/voice_room_member.controllers.js";

const router = Router();

router.post('/voice_rooms_members/createVoiceRoomMember', createVoiceRoomMember);
router.get('/voice_rooms_members/getAllVoiceRoomMembers/:room_id', getAllVoiceRoomMembers);

export default router;