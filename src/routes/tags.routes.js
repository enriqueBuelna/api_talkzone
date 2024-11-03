import { Router } from "express";

import { addTag, getAllTag } from "../controllers/tags.controllers.js";

const router = Router();

router.post("/tags/addTag", addTag);
router.get("/tags/getAllTag", getAllTag);

export default router;