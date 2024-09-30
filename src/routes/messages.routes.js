import { Router } from "express";

import { postMessage } from "../controllers/messages.controllers.js";

const router = Router();

router.post('/messages/postMessage', postMessage);

export default router;