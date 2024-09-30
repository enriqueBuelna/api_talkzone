import { Router } from "express";

import { createComment } from "../controllers/comments.controllers.js";

const router = Router();

router.post("/comments/createComment", createComment);

export default router;
