import { Router } from "express";

import { addTag, addTagGroup, getAllTag } from "../controllers/tags.controllers.js";

const router = Router();

router.post("/tags/addTag", addTag);
router.get("/tags/getAllTag", getAllTag);
router.post("/tags/addTagGroup", addTagGroup);
export default router;