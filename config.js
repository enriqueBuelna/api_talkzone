import { config } from "dotenv";
config();

export const configuracion = {
  JWT_SECRET: process.env.SECRET_KEY,
};
