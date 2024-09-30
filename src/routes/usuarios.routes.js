import { Router } from "express";

import { registerUser, loginUser, validatePreRegister } from "../controllers/usuarios.controllers.js";

const router = Router();

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users/validateEU", validatePreRegister);


export default router;
