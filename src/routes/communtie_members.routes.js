import {Router} from "express";
import {
  addMemberToCommunity,
  removeMemberFromCommunity,
  updateMemberRole,
  getMembersByCommunity,
} from "../controllers/communitie_member.controllers.js";

const router = Router();

// Ruta para agregar un miembro a una comunidad
router.post("/communities/:group_id/members", addMemberToCommunity);

// Ruta para eliminar un miembro de una comunidad
router.delete("/communities/:group_id/members/:user_id", removeMemberFromCommunity);

// Ruta para actualizar el rol de un miembro en una comunidad
router.put("/communities/:group_id/members/:user_id/role", updateMemberRole);

// Ruta para obtener todos los miembros de una comunidad
router.get("/communities/:group_id/members", getMembersByCommunity);

export default router;
