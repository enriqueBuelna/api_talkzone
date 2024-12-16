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
  getCompleteProfile,
  editProfile,
  completeProfile,
  amFollowing,
  blockUser,
  getBlockUsers,
  unblockUser
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
router.post("/users/completeProfile", completeProfile);
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
router.get("/users/getCompleteProfile", getCompleteProfile);
router.post("/users/editProfile", editProfile);
router.post("/users/amFollowing", amFollowing);
router.post("/users/blockUser", blockUser);
router.get("/users/getBlockedUser", getBlockUsers);
router.post("/users/unblockUser", unblockUser);
export default router;
