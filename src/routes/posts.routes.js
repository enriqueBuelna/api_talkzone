import { Router } from "express";

import {
  createPost,
  getAllPost,
  getPostById,
  getPostFollowing,
  getRelevantPosts,
  getFriendsPost,
  getPostLike,
  getPostGroup,
  getYourPosts,
  updatePost,
  updatePostGroup,
  searchPost,
  deletePost,
  reportPost
} from "../controllers/posts.controllers.js";
const router = Router();

router.post("/posts/newPost", createPost);
router.get("/posts/getFollowingPost/:id", getPostFollowing);
router.get("/posts/getRelevantPost/:id", getRelevantPosts);
router.get("/posts/getPostById", getPostById);
router.get("/posts/getForYou", getAllPost);
router.get("/posts/getPostFriends", getFriendsPost);
router.get("/posts/getYourPost", getYourPosts);
router.get("/posts/getLikePost",getPostLike);
router.get("/posts/getPostGroup", getPostGroup);
router.post("/posts/updatePost", updatePost);
router.post("/posts/updatePostGroup", updatePostGroup);
router.get("/posts/searchPost", searchPost);
router.delete("/posts/deletePost", deletePost);
router.post("/posts/reportPost", reportPost);
export default router;