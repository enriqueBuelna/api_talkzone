import { Router } from "express";

import { addTag } from "../controllers/tags.controllers.js";

const router = Router();

router.post("/tags/addTag", addTag);


export default router;