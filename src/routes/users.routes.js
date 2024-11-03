import { Router } from "express";
import {
  registerUser,
  loginUser,
  validatePreRegister,
  getAllUsers,
  finishProfile,
  getUserPreferences,
  sendEmailPasswordChange,
  getFollowersFollowed,
  getBasicInfo,
} from "../controllers/users.controllers.js";
import {
  authenticateToken,
  checkAdminRole,
} from "../controllers/auth.controllers.js";
import {
  createEmailVerification,
  verifyCode,
} from "../controllers/verification_email.controllers.js";

const router = Router();

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users/validateEU", validatePreRegister);
router.post("/users/passwordChanges/validateEmail", sendEmailPasswordChange);
router.get(
  "/users/getAllUsers",
  authenticateToken,
  checkAdminRole,
  getAllUsers
);
router.post("/users/finishProfile", finishProfile);
router.get("/users/getPreferences/:id", getUserPreferences);
router.post("/users/emailVerification", createEmailVerification);
router.post("/users/emailVerification/verify", verifyCode);
router.get("/users/getFollowersFollowed", getFollowersFollowed);
router.get("/users/getBasicInfo", getBasicInfo);

export default router;
