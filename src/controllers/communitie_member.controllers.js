import { Community } from "../models/communitie.model.js";
import { User } from "../models/user.model.js";
import { CommunityMember } from "../models/communitie_member.model.js";

// Agregar un usuario a una comunidad
export const addMemberToCommunity = async (req, res) => {
  try {
    const { group_id, user_id } = req.body;

    // Verificar si la comunidad y el usuario existen
    const community = await Community.findByPk(group_id);
    const user = await User.findByPk(user_id);

    if (!community) {
      return res.status(404).json({ message: "La comunidad no existe" });
    }

    if (!user) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    // Crear una nueva entrada en CommunityMember
    const newMember = await CommunityMember.create({
      group_id,
      user_id,
      role: "member", // Por defecto es "member"
    });

    res
      .status(201)
      .json({ message: "Miembro agregado exitosamente", newMember });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al agregar miembro a la comunidad" });
  }
};

// Remover un usuario de una comunidad
export const removeMemberFromCommunity = async (req, res) => {
  try {
    const { group_id, user_id } = req.params;

    // Verificar si la relación de usuario y comunidad existe
    const member = await CommunityMember.findOne({
      where: { group_id, user_id },
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "El miembro no existe en la comunidad" });
    }

    // Eliminar el miembro de la comunidad
    await member.destroy();

    res.status(200).json({ message: "Miembro eliminado de la comunidad" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al eliminar miembro de la comunidad" });
  }
};

// Cambiar el rol de un miembro en la comunidad
export const updateMemberRole = async (req, res) => {
  try {
    const { group_id, user_id } = req.params;
    const { role } = req.body;

    // Verificar si la relación de usuario y comunidad existe
    const member = await CommunityMember.findOne({
      where: { group_id, user_id },
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "El miembro no existe en la comunidad" });
    }

    // Actualizar el rol del miembro
    member.role = role;
    await member.save();

    res.status(200).json({ message: "Rol actualizado exitosamente", member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el rol del miembro" });
  }
};

// Obtener todos los miembros de una comunidad
export const getMembersByCommunity = async (req, res) => {
  try {
    const { group_id } = req.params;

    // Buscar todos los miembros de la comunidad
    const members = await CommunityMember.findAll({
      where: { group_id },
      include: [{ model: User, attributes: ["id", "username"] }],
    });

    if (members.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay miembros en esta comunidad" });
    }

    res.status(200).json({ members });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los miembros de la comunidad" });
  }
};
