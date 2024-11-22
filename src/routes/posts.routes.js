import { Router } from "express";

import {
  createPost,
  getAllPost,
  getPostById,
  getPostFollowing,
  getRelevantPosts,
  getFriendsPost,
  getPostLike,
  getPostGroup
} from "../controllers/posts.controllers.js";
import { getYourPost } from "../services/post.services.js";

const router = Router();

router.post("/posts/newPost", createPost);
router.get("/posts/getFollowingPost/:id", getPostFollowing);
router.get("/posts/getRelevantPost/:id", getRelevantPosts);
router.get("/posts/getPostById", getPostById);
router.get("/posts/getForYou", getAllPost);
router.get("/posts/getPostFriends", getFriendsPost);
router.get("/posts/getYourPost", getYourPost)
router.get("/posts/getLikePost",getPostLike);
router.get("/posts/getPostGroup", getPostGroup);

export default router;