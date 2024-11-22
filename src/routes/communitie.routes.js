import { Router } from "express";
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  getAllMyGroupsCreated,
  getGroupInformationById,
  discoverGroups,
  getGroupsFollowedd,
  getPostsByGroupp,
  wantToGetIn,
  getGroupsNotIn,
  getPendingGroups,
  getInGroup,
  pendingApplies,
  responseApply,
  editGroup
} from "../controllers/communities.controllers.js";
import { getFollowersFollowedd } from "../services/users.services.js";

const router = Router();

router.post("/communities", createCommunity);
// router.get("/communities", getCommunities);
// router.get("/communities/:id", getCommunityById);
// router.put("/communities/:id", updateCommunity);
// router.delete("/communities/:id", deleteCommunity);
router.get("/communities/getMyGroups", getAllMyGroupsCreated);
router.get("/communities/getGroupById", getGroupInformationById)
router.get("/communities/discoverGroups", discoverGroups);
router.get("/communities/getGroupsFollowed", getGroupsFollowedd);
router.get("/communities/getAllPost", getPostsByGroupp);
router.post("/communities/wantToGetIn", wantToGetIn);
router.get("/communities/getGroupsNotIn", getPendingGroups);
router.post("/communities/getInGroup", getInGroup);
router.get("/communities/getPendingApplies", pendingApplies);
router.post("/communities/responseApply", responseApply);
router.post("/communities/editGroup", editGroup);
export default router;
