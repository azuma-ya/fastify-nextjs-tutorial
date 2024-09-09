import { PrismaClient } from "@prisma/client";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Hello from Fastify and Prisma!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
