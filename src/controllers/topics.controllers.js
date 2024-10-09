import { Topic } from "../models/topic.models.js";
import { Op } from "sequelize";

//añadir muschos topics una sola vez
//solo admin o moderador
export const bulksTopic = async (req, res) => {
  try {
      let topicsData = req.body;
      await Topic.bulkCreate(topicsData);
      res.status(201).json({ message: 'Temas agregados exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al agregar temas', error });
  }
};
//añadir un tema, si tiene topic_id, es tema secundario
//solo admin o moderador
export const addTopic = async (req, res) => {
  const { topic_name, topic_id } = req.body;
  try {
    if (!topic_name) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const topicExists = await Topic.findOne({
      where: { topic_name },
    });

    if (topicExists) {
      return res
        .status(400)
        .json({ error: "Este tema ya existe" });
    }

    const newTopic = await Topic.create({
      topic_name,
      topic_id,
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};
//añadir muschos topics una sola vez
//solo admin o moderador
export const bulkSecondsTopic = async (req, res) => {
  try {
    const { id, topics } = req.body;

    // Asegúrate de que topics es un array
    if (!Array.isArray(topics)) {
      return res.status(400).json({ error: "Topics must be an array." });
    }

    // Aquí puedes realizar las operaciones necesarias con id y topics
    console.log("ID:", id);
    console.log("Topics:", topics);

    for (const topic_name of topics) {
      let topicExists = await Topic.findOne({
        where: { topic_name },
      });

      if (topicExists) {
        return res.status(400).json({ error: "El tema ya está puesto" });
      } else {
        const newTopic = await Topic.create({
          topic_name,
          topic_id: id,
        });
      }
    }

    return res.status(200).json({ message: "Topics processed successfully." });
  } catch (error) {
    console.error("Error processing topics:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

//todos lo pueden hacer
export const getPrincipalTopic = async (req, res) => {
  try {
    const mainTopics = await Topic.findAll({
      where: {
        topic_id: null,
      },
      attributes: ["id", "topic_name"], // Solo selecciona el campo topic_name
    });
    res.status(201).json(mainTopics);
  } catch (error) {

  }
};
//todos lo pueden hacer
export const getSecondTopic = async (req, res) => {
  try {
    const mainTopics = await Topic.findAll({
      where: {
        topic_id: {
          [Op.ne]: null, // Filtra donde topic_id no es null
        },
      },
      attributes: ["topic_id", "topic_name"], // Solo selecciona el campo topic_name
    });
    res.status(201).json(mainTopics);
  } catch (error) {
    console.log(error);
  }
};