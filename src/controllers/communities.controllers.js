import { User } from "../models/user.model.js";
import { Community } from "../models/communitie.model.js";
import { Topic } from "../models/topic.models.js";
import { CommunityMember } from "../models/communitie_member.model.js";
import { UserPreference } from "../models/user_preferences.model.js";
import { Op } from "sequelize";
import { CommunityJoinRequest } from "../models/community_join_request.model.js";
import {
  getUserPreferencess,
  getUserProileInformation,
} from "../services/users.services.js";
import {
  getAllGroupss,
  getGroupsFollowed,
  getGroupStatss,
  getMostPopularGroups,
  getPostsByGroup,
} from "../services/community.services.js";
import { CommunityTags } from "../models/community_tag.model.js";
import { Tag } from "../models/tag.models.js";

// Controlador del endpoint
export const searchGroup = async (req, res) => {
  const { group_name } = req.query; // Query de búsqueda
  if (!group_name) {
    return res
      .status(400)
      .json({ message: "Debes proporcionar una consulta de búsqueda." });
  }

  try {
    // Búsqueda de comunidades
    const communities = await Community.findAll({
      where: {
        [Op.or]: [
          { communitie_name: { [Op.like]: `%${group_name}%` } }, // Nombre similar
          { about_communitie: { [Op.like]: `%${group_name}%` } }, // Descripción similar
        ],
      },
      include: [
        {
          model: CommunityTags,
          as: "com_tag_id",
          include: [
            {
              as: "tag",
              model: Tag,
              where: {
                tag_name: { [Op.like]: `%${group_name}%` }, // Etiquetas similares
              },
              required: false,
            },
          ],
          required: false,
        },
        {
          model: UserPreference,
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
        },
      ],
    });

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error al buscar comunidades:", error);
    res.status(500).json({ message: "Error al buscar comunidades." });
  }
};
export const editGroup = async (req, res) => {
  const {
    group_id,
    about_communitie,
    privacy,
    cover_picture,
    profile_picture,
  } = req.body;
  let is_private;
  if (!privacy) {
    is_private = false;
  } else {
    is_private = true;
  }
  try {
    console.log(is_private);
    const group = await Community.findOne({
      where: { id: group_id },
    });
    group.about_communitie = about_communitie || group.about_communitie;
    group.is_private = is_private;
    group.profile_picture = profile_picture || group.profile_picture;
    group.cover_picture = cover_picture || group.cover_picture;
    await group.save();
    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const pendingApplies = async (req, res) => {
  const { group_id } = req.query;
  console.log(group_id);
  try {
    const petitions = await CommunityJoinRequest.findAll({
      where: {
        status: "pending",
        group_id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "gender", "profile_picture"],
        },
      ],
    });
    res.status(201).json(petitions);
  } catch (error) {
    console.error(error);
  }
};

export const getInGroup = async (req, res) => {
  const { user_id, group_id } = req.body;
  try {
    const community = await Community.findOne({
      where: { id: group_id },
      include: [
        //  {model: Topic, attributes: ["topic_name"] }
        {
          model: UserPreference,
          include: [{ model: Topic, attributes: ["id"] }],
        },
      ],
    });
    const user = formatResponse(await getUserPreferencess(user_id));

    let filter = user.find(
      (el) => el.topic_id === community.userPreference.topic.id
    );

    const newMember = await CommunityMember.create({
      role: "member",
      type: filter.type,
      user_id,
      group_id,
    });
    await community.update({
      member_count: community.member_count + 1,
    });
    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const getOutGroup = async (req, res) => {
  const { user_id, group_id } = req.body;
  try {
    const comm = await Community.findOne({
      where: { id: group_id },
    });

    const community = await CommunityMember.findOne({
      where: { group_id, user_id },
    });

    await community.destroy();
    await comm.update({
      member_count: comm.member_count - 1,
    });
    res.status(201).json(true);
  } catch (error) {
    console.log(error, "CHIVO");
  }
};

export const responseApply = async (req, res) => {
  const { status, group_id, user_id } = req.body;
  console.log(status, group_id, user_id);
  try {
    const memberApply = await CommunityJoinRequest.findOne({
      where: {
        user_id,
        group_id,
      },
    });

    memberApply.status = status;
    await memberApply.save();

    if (status === "approved") {
      const community = await Community.findOne({
        where: { id: group_id },
        include: [
          //  {model: Topic, attributes: ["topic_name"] }
          {
            model: UserPreference,
            include: [{ model: Topic, attributes: ["id"] }],
          },
        ],
      });

      const user = formatResponse(await getUserPreferencess(user_id));

      let filter = user.find(
        (el) => el.topic_id === community.userPreference.topic.id
      );

      const newMember = await CommunityMember.create({
        role: "member",
        type: filter.type,
        user_id,
        group_id,
      });

      await community.update({
        member_count: community.member_count + 1,
      });
    }

    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByGroupp = async (req, res) => {
  const { user_id, page } = req.query;
  try {
    const matchingPost = await getPostsByGroup(user_id, page);
    res.status(201).json(matchingPost);
  } catch (error) {
    res.status(404).json(error);
  }
};

// export const discoverGroups = async (req, res) => {
//   const { user_id } = req.query;
//   try {
//     let user = formatResponse(await getUserPreferencess(user_id));
//     const topicIds = user.map((pref) => pref.topic_id);
//     const ids = await CommunityMember.findAll({
//       where: { user_id, [Op.not]: { role: "admin" } },
//       attributes: ["group_id"],
//     });
//     let idGroup = ids.map((el) => el.group_id);
//     console.log(idGroup);
//     // Consulta mejorada
//     const communities = await Community.findAll({
//       where: {
//         [Op.and]: [
//           { creator_id: { [Op.ne]: user_id } }, // El creador no debe ser el usuario
//           { id: { [Op.notIn]: idGroup } }, // La comunidad no debe estar entre las que el usuario ya es miembro
//         ],
//       },
//       include: [
//         {
//           model: UserPreference,
//           where: { topic_id: topicIds }, // Filtrar por los temas de interés del usuario
//           include: [
//             {
//               model: Topic,
//               attributes: ["topic_name"],
//             },
//           ],
//         },
//       ],
//     });
//     res.status(201).json(communities);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const discoverGroups = async (req, res) => {
  const { user_id, limit = 10, page = 1 } = req.query; // Valores por defecto
  try {
    const offset = (page - 1) * limit; // Calcular el desplazamiento para la paginación

    // Obtener las preferencias del usuario
    let user = formatResponse(await getUserPreferencess(user_id));
    const topicIds = user.map((pref) => pref.topic_id);

    // Obtener las comunidades a las que ya pertenece el usuario
    const ids = await CommunityMember.findAll({
      where: { user_id, [Op.not]: { role: "admin" } },
      attributes: ["group_id"],
    });
    let idGroup = ids.map((el) => el.group_id);

    // Consulta para obtener comunidades
    const communities = await Community.findAll({
      where: {
        [Op.and]: [
          { creator_id: { [Op.ne]: user_id } }, // El creador no debe ser el usuario
          { id: { [Op.notIn]: idGroup } }, // La comunidad no debe estar entre las que el usuario ya es miembro
        ],
        status: 'active'
      },
      include: [
        {
          model: UserPreference,
          where: { topic_id: topicIds }, // Filtrar por los temas de interés del usuario
          include: [
            {
              model: Topic,
              attributes: ["topic_name"],
            },
          ],
        },
      ],
      limit,
      offset,
    });
    res.status(201).json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al descubrir grupos" });
  }
};

// Crear una nueva comunidad
export const createCommunity = async (req, res) => {
  const {
    communitie_name,
    about_communitie,
    creator_id,
    is_private,
    type,
    user_preference_id,
  } = req.body;

  try {
    // Verificar que el usuario creador exista
    const user = await User.findByPk(creator_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pref = await UserPreference.findByPk(user_preference_id);
    if (!pref) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCommunity = await Community.create({
      communitie_name,
      about_communitie,
      creator_id,
      is_private,
      type,
      user_preference_id,
    });

    const newMember = await CommunityMember.create({
      role: "admin",
      type,
      user_id: creator_id,
      group_id: newCommunity.id,
    });

    await newCommunity.update({
      member_count: newCommunity.member_count + 1,
    });

    res.status(201).json(newCommunity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating community" });
  }
};

// Obtener todas las comunidades
export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll();
    res.status(200).json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching communities" });
  }
};

// Obtener una comunidad por ID
export const getCommunityById = async (req, res) => {
  const { id } = req.params;

  try {
    const community = await Community.findOne({
      where: { id },
      include: [
        {
          model: UserPreference,
          include: [{ model: Topic, attributes: ["topic_name"] }],
        },
      ],
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching community" });
  }
};

// Actualizar una comunidad
export const updateCommunity = async (req, res) => {
  const { id } = req.params;
  const { communitie_name, about_communitie, is_private } = req.body;

  try {
    const community = await Community.findByPk(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    await community.update({
      communitie_name,
      about_communitie,
      is_private,
    });

    res.status(200).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating community" });
  }
};

// Eliminar una comunidad
export const deleteCommunity = async (req, res) => {
  const { id } = req.params;

  try {
    const community = await Community.findByPk(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    await community.destroy();

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting community" });
  }
};

export const getAllMyGroupsCreated = async (req, res) => {
  const { creator_id } = req.query;
  try {
    const community = await Community.findAll({
      where: { creator_id },
      include: [
        //  {model: Topic, attributes: ["topic_name"] }
        {
          model: UserPreference,
          include: [{ model: Topic, attributes: ["topic_name"] }],
        },
      ],
    });
    res.status(201).json(community);
  } catch (error) {
    console.log(error);
  }
};

export const getBasicInformation = async (req, res) => {
  const { id } = req.query;
  try {
    const community = await Community.findOne({
      where: { id },
      include: [
        // { model: Topic, attributes: ["topic_name"] }
        {
          model: UserPreference,
          include: [{ model: Topic, attributes: ["topic_name"] }],
        },
      ],
    });
    res.status(201).json(community);
  } catch (error) {}
};

export const getGroupInformationById = async (req, res) => {
  const { id } = req.query;
  try {
    const community = await Community.findOne({
      where: { id },
      include: [
        // { model: Topic, attributes: ["topic_name"] },
        {
          model: CommunityMember,
          attributes: ["id", "role", "type"],
          include: [
            {
              model: User,
              attributes: ["id", "username", "profile_picture", "gender"],
            },
          ],
        },
        {
          model: UserPreference,
          include: [{ model: Topic, attributes: ["topic_name", "id"] }],
        },
        {
          model: CommunityTags,
          where: { group_id: id },
          include: [
            {
              model: Tag,
              attributes: ["tag_name", "id", "topic_id"],
            },
          ],
          required: false,
        },
      ],
    });
    res.status(201).json(community);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

function formatResponse(data) {
  return data.map((item) => ({
    id: item.id,
    type: item.type, // Cambiado de type a role para reflejar el nuevo formato
    topic_id: item.topic_id,
    tags: item.userPreferenceTags.map((tag) => tag.tag_id),
  }));
}

export const wantToGetIn = async (req, res) => {
  const { user_id, group_id } = req.body;
  try {
    const existingRequest = await CommunityJoinRequest.findOne({
      where: {
        user_id,
        group_id,
      },
    });

    if (existingRequest) {
      if (
        existingRequest.status === "rejected" ||
        existingRequest.status === "approved"
      ) {
        existingRequest.status = "pending";
        await existingRequest.save();
        res.status(201).json(true);
      }
      res.status(201).json(true);
    }

    // Si no existe, creas la nueva solicitud
    const wantToGetIn = await CommunityJoinRequest.create({
      user_id,
      group_id,
    });

    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

//para mostrar en los grupos que sigo
export const getGroupsFollowedd = async (req, res) => {
  const { user_id } = req.query;
  try {
    const groups = await getGroupsFollowed(user_id);
    res.status(201).json(groups);
  } catch (error) {}
};

//conseguir grupos en donde mi solicitud esta pendiente:

export const getPendingGroups = async (req, res) => {
  const { user_id } = req.query;
  try {
    console.log("hola");
    const pendingGroup = await CommunityJoinRequest.findAll({
      where: {
        user_id,
        status: "pending",
      },
      attributes: ["group_id"],
    });

    let idGroup = pendingGroup.map((el) => el.group_id);
    console.log(idGroup);
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
    res.status(201).json(groups);
  } catch (error) {
    console.log(error);
  }
};

export const getGroupsNotIn = async (req, res) => {
  const { user_id } = req.query;
};

export const viewIfOnePending = async (req, res) => {
  const { user_id, group_id } = req.body;
  try {
    const existingRequest = await CommunityJoinRequest.findOne({
      where: {
        user_id,
        group_id,
      },
    });
    if (existingRequest.status === "pending") {
      res.status(201).json(true);
    } else {
      res.status(201).json(false);
    }
  } catch (error) {}
};

export const deleteApply = async (req, res) => {
  const { user_id, group_id } = req.body;
  try {
    const existingRequest = await CommunityJoinRequest.findOne({
      where: {
        user_id,
        group_id,
      },
    });
    await existingRequest.destroy();
    res.status(201).json(true);
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroups = async (req, res) => {
  try {
    let allGroups = await getAllGroupss();
    res.status(201).json(allGroups);
  } catch (error) {
    console.log(error);
  }
};

export const mostPopularGroups = async (req, res) => {
  try {
    let mostGroups = await getMostPopularGroups();
    res.status(201).json(mostGroups);
  } catch (error) {
    console.log(error);
  }
};

export const getGroupStats = async (req, res) => {
  const { id } = req.query;
  try {
    let groups = await getGroupStatss(id);
    res.status(201).json(groups);
  } catch (error) {
    res.status(402).json(error);
  }
};
