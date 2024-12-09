import { Router } from "express";

import {
  postMessage,
  getMessages,
  getMyConversations,
  getUnreadMessages,
  reportMessage
} from "../controllers/messages.controllers.js";

const router = Router();

router.post("/messages/postMessage", postMessage);
router.get("/messages/getMessages", getMessages);
router.get("/messages/getMyConversations", getMyConversations);
router.get("/messages/getUnreadMessages", getUnreadMessages)
router.post("/messages/reportMessage", reportMessage);
export default router;
