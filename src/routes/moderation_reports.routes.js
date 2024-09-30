import { Router } from "express";
import {
  createModerationReport,
  getAllModerationReports,
} from "../controllers/moderation_reports.controllers.js";

const router = Router();

// Ruta para crear un nuevo informe de moderación
router.post("/moderationReports", createModerationReport);

// Ruta para obtener todos los informes de moderación
router.get("/moderationReports", getAllModerationReports);

export default router;
