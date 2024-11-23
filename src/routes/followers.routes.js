import { Router } from "express";

import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/followers.controllers.js";

const router = Router();

router.post('/followers/followUser', followUser);
router.post('/followers/unfollowUser', unfollowUser);
router.get('/followers/getFollowers/:id', getFollowers);
router.get('/followers/getFollowing/:id', getFollowing);

export default router;
