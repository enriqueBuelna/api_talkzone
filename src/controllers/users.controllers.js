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
} from "../services/users.services.js";

export const registerUser = async (req, res) => {
  try {
    const newUserId = await registerUserService(req.body);
    res.status(201).json(newUserId);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPreferences = async (req, res) => {
  const { id } = req.params; // Obtén el id del usuario de los parámetros de la solicitud
  try {
    console.log(id);
    const preferences = await getUserPreferencess(id);
    res.status(201).json(preferences);
  } catch (error) {}
};

export const getFollowersFollowed = async (req, res) => {
  const { user_id } = req.query;
  try {
    const followersFollowed = await getFollowersFollowedd(user_id);
    res.status(201).json(followersFollowed);
  } catch (error) {
    console.log(error);
  }
};

export const getBasicInfo = async (req, res) => {
  const { user_id } = req.query;
  try {
    const user = await getBasicInfoo(user_id);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};
