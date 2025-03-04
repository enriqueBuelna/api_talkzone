// follower.controller.js
import * as followerService from "../services/followers.services.js";
import { createNotification } from "../services/notification.services.js";
 
export const followUser = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    const newFollow = await followerService.followUser(
      follower_id,
      followed_id
    );
    await createNotification(
      follower_id,
      followed_id,
      "follower",
      null,
      null,
      null,
      null,
      null,
      follower_id
    );
    return res.status(201).json(true);
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
  }
};

export const deleteFollower = async (req, res) => {
  const { user_id, user_follower } = req.body;

  try {
    const result = await followerService.deleteFollower(user_id, user_follower);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const unfollowUser = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    const result = await followerService.unfollowUser(follower_id, followed_id);
    return res.status(200).json(true);
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
    return res
      .status(500)
      .json({ message: "Error al obtener usuarios seguidos" });
  }
};
