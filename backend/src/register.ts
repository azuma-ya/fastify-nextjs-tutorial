import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

import { createTodoRoutes } from "./routes/todo";

export const registerRoutes = async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
  await app.register(createTodoRoutes);
};
