import { configuracion } from "../../config.js";
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  jwt.verify(token, configuracion.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "No tienes acceso a este recurso",
      });
    }

    // Aquí almacenas los datos del token decodificado en req.user
    req.user = decoded;

    // Esto incluirá el id, username, y el role que almacenaste en el token
  });

  next();
};

// Middleware para verificar el rol de administrador
export const checkAdminRole = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado, solo administradores" });
  }
  next(); // Si es admin, sigue con la lógica de la ruta
};