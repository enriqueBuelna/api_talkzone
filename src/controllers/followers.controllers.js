import { User } from "../models/usuario.model.js";
import { Follower } from "../models/follower.model.js";

// Seguir a un usuario
export const followUser = async (req, res) => {
    try {
      const { follower_id, followed_id } = req.body;
  
      // Verifica que los usuarios no sean los mismos
      if (follower_id === followed_id) {
        return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
      }
  
      // Verifica que la relación no exista
      const existingFollow = await Follower.findOne({ where: { follower_id, followed_id } });
      if (existingFollow) {
        return res.status(400).json({ message: "Ya sigues a este usuario" });
      }
  
      // Crea la relación de seguimiento
      const newFollow = await Follower.create({ follower_id, followed_id });
      return res.status(201).json({ message: "Usuario seguido con éxito", newFollow });
    } catch (error) {
      console.error("Error al seguir al usuario:", error);
      res.status(500).json({ message: "Error al seguir al usuario" });
    }
  };
  
  // Dejar de seguir a un usuario
  export const unfollowUser = async (req, res) => {
    try {
      const { follower_id, followed_id } = req.body;
  
      // Elimina la relación de seguimiento
      const result = await Follower.destroy({ where: { follower_id, followed_id } });
  
      if (result) {
        return res.status(200).json({ message: "Has dejado de seguir al usuario" });
      } else {
        return res.status(404).json({ message: "No sigues a este usuario" });
      }
    } catch (error) {
      console.error("Error al dejar de seguir al usuario:", error);
      res.status(500).json({ message: "Error al dejar de seguir al usuario" });
    }
  };
  
  // Listar a los seguidores de un usuario
  export const getFollowers = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const followers = await Follower.findAll({
        where: { followed_id: user_id },
        include: [{ model: User, as: 'follower' }],
      });
  
      return res.status(200).json(followers);
    } catch (error) {
      console.error("Error al obtener seguidores:", error);
      res.status(500).json({ message: "Error al obtener seguidores" });
    }
  };
  
  // Listar a los usuarios seguidos por un usuario
  export const getFollowing = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const following = await Follower.findAll({
        where: { follower_id: user_id },
        include: [{ model: User, as: 'followed' }],
      });
  
      return res.status(200).json(following);
    } catch (error) {
      console.error("Error al obtener usuarios seguidos:", error);
      res.status(500).json({ message: "Error al obtener usuarios seguidos" });
    }
  };