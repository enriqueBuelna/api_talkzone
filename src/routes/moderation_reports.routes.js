import { Router } from "express";
import {
  createModerationReport,
  getAllModerationReports,
  getModerationReportById,
} from "../controllers/moderation_reports.controllers.js";

const router = Router();

router.post("/moderationReports", createModerationReport);
router.get("/admin/moderationReports", getAllModerationReports);
router.get("/admin/moderationReports/getById", getModerationReportById);

export default router;