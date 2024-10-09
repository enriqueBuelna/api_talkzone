// follower.controller.js
import * as followerService from '../services/followers.services.js';

export const followUser = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    const newFollow = await followerService.followUser(follower_id, followed_id);
    return res.status(201).json({ message: "Usuario seguido con éxito", newFollow });
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    const result = await followerService.unfollowUser(follower_id, followed_id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error al dejar de seguir al usuario:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  const { user_id } = req.params;

  try {
    const followers = await followerService.getFollowers(user_id);
    return res.status(200).json(followers);
  } catch (error) {
    console.error("Error al obtener seguidores:", error);
    return res.status(500).json({ message: "Error al obtener seguidores" });
  }
};

export const getFollowing = async (req, res) => {
  const { id } = req.params;

  try {
    const following = await followerService.getFollowing(id);
    return res.status(200).json(following);
  } catch (error) {
    console.error("Error al obtener usuarios seguidos:", error);
    return res.status(500).json({ message: "Error al obtener usuarios seguidos" });
  }
};
