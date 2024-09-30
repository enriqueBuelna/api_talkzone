import { Router } from "express";

import { addTopic, bulkSecondsTopic, bulksTopic, getPrincipalTopic, getSecondTopic } from "../controllers/topics.controllers.js";

const router = Router();

router.post("/topics/addTopic", addTopic);
router.get("/topics/getPrincipalTopic", getPrincipalTopic);
router.get("/topics/getSecondTopic", getSecondTopic);
router.post("/topics/bulkTopic", bulksTopic);
router.post("/topics/bulkSecondTopic", bulkSecondsTopic);


export default router;