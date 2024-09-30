import { Router } from "express";

import { createLike, deleteLike } from "../controllers/like.controllers.js";

const router = Router();

router.post("/like/addLike",createLike);
router.delete("/like/deleteLike", deleteLike);

export default router;