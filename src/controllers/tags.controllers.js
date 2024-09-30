import { Topic } from "../models/topic.models.js";
import { Tag } from "../models/tag.models.js";

export const addTag = async (req, res) => {
  const { tag_name, topic_id } = req.body;
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
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};