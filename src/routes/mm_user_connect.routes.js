import { Router } from "express";

import { matchmakingConnect, searchConnect } from "../controllers/mm_user_connect.controllers.js";

const router = Router();

router.get('/matchmakingConnect', matchmakingConnect);
router.get('/searchConnect', searchConnect);
export default router;