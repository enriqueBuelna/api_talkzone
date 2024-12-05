import { Router } from "express";

import { getNotifications, markAsRead, createNotification, getCantNotifications } from "../controllers/notifications.controllers.js"

const router = Router();

router.post("/notifications/createNotification", createNotification);
router.get("/notifications/getNotification", getNotifications);
router.post("/notifications/markAsRead", markAsRead);
router.get("/notifications/getCantNotifications", getCantNotifications);
export default router;