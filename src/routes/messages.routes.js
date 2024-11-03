import { Router } from "express";

import {
  postMessage,
  getMessages,
  getMyConversations,
} from "../controllers/messages.controllers.js";

const router = Router();

router.post("/messages/postMessage", postMessage);
router.get("/messages/getMessages", getMessages);
router.get("/messages/getMyConversations", getMyConversations);

export default router;
