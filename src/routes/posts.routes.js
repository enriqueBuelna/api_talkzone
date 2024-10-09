import { Router } from "express";

import {
  createPost,
  getPostById,
  getPostFollowing,
  getRelevantPosts,
} from "../controllers/posts.controllers.js";

const router = Router();

router.post("/posts/createPost", createPost);
router.get("/posts/getFollowingPost/:id", getPostFollowing);
router.get("/posts/getRelevantPost/:id", getRelevantPosts);
router.get("/posts/getPostById/:id", getPostById);

export default router;
