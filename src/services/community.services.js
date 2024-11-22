import { Community } from "../models/communitie.model.js";
import { CommunityMember } from "../models/communitie_member.model.js";
import { Op } from "sequelize";
import { Topic } from "../models/topic.models.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.models.js";
export const getPostsByGroup = async (user_id) => {
  try {
    const ids = await CommunityMember.findAll({
      where: { user_id },
      attributes: ["group_id"],
    });
    let idGroup = ids.map(el => el.group_id);
    console.log(idGroup);
    const matchingPost = await Post.findAll({
      where: {
        community_id: idGroup,
        [Op.not]: { user_id }
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
      ],
    });
    return matchingPost;
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
}

export const getGroupsFollowed = async (user_id) => {
  try {
    const ids = await CommunityMember.findAll({
      where: { user_id, [Op.not]: { role: "admin" } },
      attributes: ["group_id"],
    });
    let idGroup = ids.map(el => el.group_id);

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

