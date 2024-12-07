import { Router } from "express";

import { getPrincipalStats, getAllUsers, getMostFollowed, getDetailUser } from "../controllers/admin.controllers.js";

const router = Router();

router.get("/admin/getPrincipalStats", getPrincipalStats);
router.get("/admin/getAllUsers", getAllUsers)
router.get("/admin/getMostFollowed", getMostFollowed);
router.get("/admin/getDetailUser", getDetailUser);
export default router;