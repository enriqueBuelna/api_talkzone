import { Router } from "express";

import { prueba } from "../controllers/mm_user_connect.controllers.js";

const router = Router();

router.post('/matchmakingConnect', prueba);

export default router;