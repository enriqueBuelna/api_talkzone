import { Router } from "express";
import {
  registerUser,
  loginUser,
  validatePreRegister,
  getAllUsers,
  finishProfile,
  getUserPreferences
} from "../controllers/users.controllers.js";
import { authenticateToken, checkAdminRole } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users/validateEU", validatePreRegister);
router.get("/users/getAllUsers", authenticateToken, checkAdminRole, getAllUsers);
router.post("/users/finishProfile", finishProfile);
router.get("/users/getPreferences/:id", getUserPreferences);

export default router;