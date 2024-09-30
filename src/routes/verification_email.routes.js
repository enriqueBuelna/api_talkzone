import { Router } from "express";

import { createEmailVerification, verifyCode } from "../controllers/verification_email.controllers.js";

const router = Router();

router.post('/emailVerification', createEmailVerification);
router.post('/emailVerification/verify', verifyCode);

export default router;