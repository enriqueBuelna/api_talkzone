import { Topic } from "../models/topic.models.js";
import { Tag } from "../models/tag.models.js";
import { CommunityTags } from "../models/community_tag.model.js";

export const addTag = async (req, res) => {
  const { tag_name, topic_id } = req.body;
  console.log(tag_name, topic_id);
  try {
    if (!tag_name) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const tagExists = await Topic.findOne({
      where: { topic_name: tag_name },
    });

    if (tagExists) {
      return res.status(400).json({ error: "Este tema ya existe" });
    }

    const newTag = await Tag.create({
      tag_name,
      topic_id,
    });

    const returnValue = {
      id: newTag.id,
      tag_name: newTag.tag_name,
      topic_id: newTag.topic_id
    };

    res.status(200).json(returnValue);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getAllTag = async (req, res) => {
  try {
    const { topic_id } = req.query;
    const allTag = await Tag.findAll({
      where: {
        topic_id,
      },
      attributes: ["topic_id", "tag_name", "id"], // Solo selecciona topic_id y topic_name
    });

    res.status(200).json(allTag); // Código 200 para éxito
  } catch (error) {}
};

export const addTagGroup = async (req, res) => {
  try {
    const {group_id,tag_id} = req.query;
    const oneTag = await CommunityTags.create({
      group_id,
      tag_id
    })

    let newTag = await Tag.findByPk(tag_id);

    const returnValue = {
      id: newTag.id,
      tag_name: newTag.tag_name,
      topic_id: newTag.topic_id
    };
    res.status(201).json(returnValue);
  } catch (error) {
    console.log(error);
  }
}