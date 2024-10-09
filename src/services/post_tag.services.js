import { PostTag } from "../models/post_tag.model.js";

export const createPostTagService = (post_id, tag_id) => {
  try {
    const post_tag = PostTag.create({
        post_id,
        tag_id
    });

    return post_tag;
  } catch (error) {}
};
