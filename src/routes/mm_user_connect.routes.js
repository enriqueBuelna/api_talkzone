import { Router } from "express";

import { matchmakingConnect } from "../controllers/mm_user_connect.controllers.js";

const router = Router();

router.get('/matchmakingConnect', matchmakingConnect);

export default router;