import { Router } from "express";

import { createVoiceRoom } from "../controllers/voice_rooms.controllers.js";

const router = Router();

router.post('/voice_rooms/createVoiceroom', createVoiceRoom);

export default router;