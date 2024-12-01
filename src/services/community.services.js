import { Community } from "../models/communitie.model.js";
import { CommunityMember } from "../models/communitie_member.model.js";
import { Op } from "sequelize";
import { Topic } from "../models/topic.models.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.models.js";
import { Like } from "../models/like.model.js";
export const getPostsByGroup = async (user_id) => {
  try {
    const ids = await CommunityMember.findAll({
      where: { user_id },
      attributes: ["group_id"],
    });
    let idGroup = ids.map((el) => el.group_id);
    const communityNames = await Community.findAll({
      where: { id: idGroup },
      attributes: ["id", "communitie_name", "profile_picture"],
    });
    const communityMap = communityNames.reduce((acc, community) => {
      acc[community.id] = {
        communitie_name: community.communitie_name,
        profile_picture: community.profile_picture,
      };
      return acc;
    }, {});

    const matchingPost = await Post.findAll({
      where: {
        community_id: idGroup,
        [Op.not]: { user_id },
      },
      include: [
        {
          model: User,
          as: "post_user",
          attributes: ["id", "username", "gender", "profile_picture"],
        },
        {
          model: UserPreference,
          as: "post_user_preference",
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
          attributes: ["topic_id", "type"],
        },
        {
          model: Like,
          as: "post_liked",
          attributes: ["id", "user_id"], // No uses la cláusula where aquí
          required: false,
        },
      ],
    });

    const processedPosts = matchingPost.map((post) => {
      const filteredLikes = post.post_liked.filter(
        (like) => like.user_id === user_id
      );

      return {
        ...post.toJSON(),
        post_liked: filteredLikes,
        community_name: communityMap[post.community_id],
        profile_picture: communityMap[post.profile_picture],
      };
    });

    return processedPosts;
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

export const getGroupsFollowed = async (user_id) => {
  try {
    const ids = await CommunityMember.findAll({
      where: { user_id, [Op.not]: { role: "admin" } },
      attributes: ["group_id"],
    });
    let idGroup = ids.map((el) => el.group_id);

    const groups = await Community.findAll({
      where: { id: idGroup },
      include: [
        // { model: Topic, attributes: ["topic_name"] }
        {
          model: UserPreference,
          include: [{ model: Topic, attributes: ["topic_name"] }],
        },
      ],
    });
    return groups;
  } catch (error) {
    console.log(error);
  }
};

// export const groupInformation = async () => {
// }
