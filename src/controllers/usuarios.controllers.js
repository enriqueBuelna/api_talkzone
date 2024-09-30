import { User } from "../models/usuario.model.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const registerUser = async (req, res) => {
  const { username, email, hashedPassword, date_of_birth, gender } = req.body;
  try {
    if (!username || !hashedPassword || !email || !date_of_birth || !gender) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const nombreUsuarioExistente = await User.findOne({
      where: { username },
    });
    if (nombreUsuarioExistente) {
      return res
        .status(400)
        .json({ error: "Este nombre de usuario ya está en uso" });
    }

    const hashedPasswordd = await bcrypt.hash(hashedPassword, 10);

    const nuevoUsuario = await User.create({
      username,
      email,
      date_of_birth,
      gender,
      hashedPassword: hashedPasswordd,
    });
    res.status(201).json(nuevoUsuario.id);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
    });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new Error("password invalid");

    const { password: _, ...publicUser } = user.dataValues;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .send({ username, token });
  } catch (error) {
    res.status(500).json({ message: "Error al encontrar el usuario", error });
  }
};

export const finishProfile = async (req, res) => {
  const { about_me, profile_pic } = req.body;
  try {
    if (!about_me || !profile_pic) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const perfilActualizado = await User.create({
      profile_pic,
      about_me,
    });

    res.status(200);
  } catch (error) {}
};

export const validatePreRegister = async (req, res) => {
  try {
    const { email, username } = req.body;

    // Verificar si el correo ya existe
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    // Verificar si el nombre de usuario ya existe
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    // Si todo está disponible
    res.json({ message: "El correo y el nombre de usuario están disponibles" });
  } catch (error) {
    res.status(500).json({ message: "Error al validar", error });
  }
};
