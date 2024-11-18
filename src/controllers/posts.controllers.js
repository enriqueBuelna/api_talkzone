import {
  createPostService,
  updatePostService,
  deletePostService,
  getPostFollowingService,
  getPostTopicsService,
  getPostByIdService,
  getPostAll,
  getPostFriends,
  getLikePost
} from "../services/post.services.js";

export const createPost = async (req, res) => {
  const { user_id, content, media_url, visibility, user_preference_id, tags } = req.body;

  try {
    const newPost = await createPostService(
      user_id,
      content,
      media_url,
      visibility,
      user_preference_id,
      tags
    );
    return res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  const {id} = req.query;
  try {
    const post = await getPostByIdService(id);
    return res.status(201).json(post);
  } catch (error) {
    console.log(error)
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params; // ID del post que se quiere actualizar
  const { content, media_url, visibility, topic_id } = req.body;

  try {
    const updatedPost = await updatePostService(id, {
      content,
      media_url,
      visibility,
      topic_id,
    });
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params; // ID del post que se quiere eliminar

  try {
    const result = await deletePostService(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
};

export const getPostFollowing = async (req, res) => {
  const { id } = req.params;

  try {
    const postsData = await getPostFollowingService(id);
    return res.status(200).json(postsData);
  } catch (error) {}
};

export const getRelevantPosts = async (req, res) => {
  const { id } = req.params; // ID del usuario que hace la solicitud
  try {
    let results = await getPostTopicsService(id);
    res.status(201).json(results);
  } catch (error) {}
};

export const getAllPost = async (req, res ) => {
  const {user_id, page} = req.query;
  try {
    let results = await getPostAll(user_id, page);
    res.status(201).json(results);
  } catch (error) {
    console.log(error);
  }
}

export const getFriendsPost = async (req, res) => {
  const {user_id} = req.query;
  try {
    let results = await getPostFriends(user_id);
    res.status(201).json(results);
  } catch (error) {
    
  }
}

export const getPostLike = async (req, res) => {
  const {user_id, page} = req.query;
  try {
    let results = await getLikePost(user_id, page);
    res.status(201).json(results);
  } catch (error) {
    
  }
}