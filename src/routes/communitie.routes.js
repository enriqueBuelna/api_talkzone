import { Router } from "express";
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity
} from "../controllers/communities.controllers.js";

const router = Router();

router.post("/communities", createCommunity);
router.get("/communities", getCommunities);
router.get("/communities/:id", getCommunityById);
router.put("/communities/:id", updateCommunity);
router.delete("/communities/:id", deleteCommunity);

export default router;
