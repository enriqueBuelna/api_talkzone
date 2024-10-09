import { User } from "../models/user.model.js";
import { Community } from "../models/communitie.model.js";

// Crear una nueva comunidad
export const createCommunity = async (req, res) => {
  const { communitie_name, about_communitie, creator_id, is_private } =
    req.body;

  try {
    // Verificar que el usuario creador exista
    const user = await User.findByPk(creator_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCommunity = await Community.create({
      communitie_name,
      about_communitie,
      creator_id,
      is_private,
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
    const community = await Community.findByPk(id);

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
