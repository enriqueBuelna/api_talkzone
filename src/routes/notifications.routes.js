import { Router } from "express";

import { getNotifications, markAsRead, createNotification } from "../controllers/notifications.controllers.js"

const router = Router();

router.post("/notifications/createNotification", createNotification);
router.get("/notifications/getNotification", getNotifications);
router.post("/notiications/markAsRead", markAsRead);

export default router;
