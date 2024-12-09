import { Router } from "express";

import { getPrincipalStats, getAllUsers, getMostFollowed, getDetailUser, getTopTopics, getTopHosts, getTopTopicsRoom, getStatsCurious, deleteContent } from "../controllers/admin.controllers.js";
import { getAllGroups, mostPopularGroups, getGroupStats } from "../controllers/communities.controllers.js";

const router = Router();

router.get("/admin/getPrincipalStats", getPrincipalStats);
router.get("/admin/getAllUsers", getAllUsers)
router.get("/admin/getMostFollowed", getMostFollowed);
router.get("/admin/getDetailUser", getDetailUser);
router.get("/admin/getMostPopular", mostPopularGroups);
router.get("/admin/getAllGroups", getAllGroups);
router.get("/admin/getCuriosStats", getStatsCurious)
router.get("/admin/getGroupsStats", getGroupStats);
router.get("/admin/getTopTopicsPost", getTopTopics);
router.get("/admin/getTopTopicsRoom", getTopTopicsRoom)
router.get("/admin/getTopHost", getTopHosts);
router.post("/admin/deleteContent", deleteContent);
export default router;