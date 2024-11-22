import { Router } from "express";

import {
  deleteLike,
  toggleLike,
} from "../controllers/like.controllers.js";

const router = Router();

router.post("/like/addLike", toggleLike);
router.delete("/like/deleteLike", deleteLike);

export default router;
