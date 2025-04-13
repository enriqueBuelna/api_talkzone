import { BlockedUsers } from "../models/blocked_users.model.js";
import { Follower } from "../models/follower.model.js";
import { User } from "../models/user.model.js";
import { Op } from "sequelize";
import {
  registerUserService,
  loginUserService,
  finishProfileService,
  validatePreRegisterService,
  getAllUsersService,
  getUserPreferencess,
  sendEmailPasswordChangeService,
  getFollowersFollowedd,
  getBasicInfoo,
  getCompleteProfilee,
  editProfilee,
} from "../services/users.services.js";
import { Chat } from "../models/chat.model.js";

export const unblockUser = async (req, res) => {
  let {blocker_user_id, blocked_user_id} = req.body;
  try {
    let block = await BlockedUsers.findOne({
      where: {
        blocked_user_id,
        blocker_user_id
      }
    })

    if(block){
      await block.destroy();
    }
    return res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
}

export const getBlockUsers = async (req, res) => {
  let { user_id } = req.query;
  try {
    let users = await BlockedUsers.findAll({
      where: {
        blocker_user_id: user_id,
      },
      include: [
        {
          model: User,
          as: "blocked",
          attributes: ["id", "username", "profile_picture", "gender"],
        },
      ],
    });
    return res.status(201).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const blockUser = async (req, res) => {
  const { blocked_user_id, blocker_user_id } = req.body;
  try {
    const newBlock = await BlockedUsers.create({
      blocked_user_id,
      blocker_user_id,
    });
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { user1: blocked_user_id, user2: blocker_user_id },
          { user1: blocker_user_id, user2: blocked_user_id },
        ],
      },
    });
    console.log(chat);
    if (chat) {
      await chat.destroy();
    }
    let followers = await Follower.findAll({
      where: {
        [Op.or]: [
          { follower_id: blocked_user_id, followed_id: blocker_user_id },
          { follower_id: blocker_user_id, followed_id: blocked_user_id },
        ],
      },
    });
    console.log(followers);
    if (followers) {
      followers.forEach(async (el) => {
        await el.destroy();
      });
    }
    return res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const amFollowing = async (req, res) => {
  const { user_id, other_user_id } = req.body;
  try {
    console.log(user_id, other_user_id);
    let following = await Follower.findOne({
      where: {
        followed_id: other_user_id,
        follower_id: user_id,
      },
    });

    if (following) {
      return res.status(201).json(true);
    }
    return res.status(201).json(false);
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { publicUser, token } = await registerUserService(req.body);
    let user = {
      id: publicUser.id,
      username: publicUser.username,
      user_role: publicUser.user_role,
      is_profile_complete: publicUser.is_profile_complete,
      is_banned: publicUser.is_banned,
    };
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json({
        user,
        token,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { user_id } = req.body;

    let user = await User.findOne({
      where: {
        id: user_id,
      },
    });

    user.update({
      is_profile_complete: true,
    });

    return res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { publicUser, token } = await loginUserService(req.body);
    let user = {
      id: publicUser.id,
      username: publicUser.username,
      user_role: publicUser.user_role,
      is_profile_complete: publicUser.is_profile_complete,
      is_banned: publicUser.is_banned,
    };
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json({
        user,
        token,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const finishProfile = async (req, res) => {
  try {
    console.log("HOLA");
    const updatedProfile = await finishProfileService(req.body);
    return res.status(200).json(updatedProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const validatePreRegister = async (req, res) => {
  try {
    const message = await validatePreRegisterService(req.body);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmailPasswordChange = async (req, res) => {
  try {
    const message = await sendEmailPasswordChangeService(req.body);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPreferences = async (req, res) => {
  const { id } = req.params; // Obtén el id del usuario de los parámetros de la solicitud
  try {
    console.log(id);
    const preferences = await getUserPreferencess(id);
    return res.status(201).json(preferences);
  } catch (error) {}
};

export const getFollowersFollowed = async (req, res) => {
  const { user_id } = req.query;
  try {
    const followersFollowed = await getFollowersFollowedd(user_id);
    return res.status(201).json(followersFollowed);
  } catch (error) {
    console.log(error);
  }
};

export const getBasicInfo = async (req, res) => {
  const { user_id } = req.query;
  try {
    const user = await getBasicInfoo(user_id);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const getCompleteProfile = async (req, res) => {
  const { user_id, myUserId } = req.query;
  try {
    const user = await getCompleteProfilee(user_id, myUserId);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  const { user_id, profile_picture, cover_picture, about_me, username } =
    req.body;
  try {
    const user = await editProfilee(
      user_id,
      profile_picture,
      cover_picture,
      about_me,
      username
    );
    return res.status(201).json(user);
  } catch (error) {}
};
