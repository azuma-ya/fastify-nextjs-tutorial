import Fastify, { FastifyRequest, FastifyReply } from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Hello from Fastify and Prisma!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log("Server running at http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
