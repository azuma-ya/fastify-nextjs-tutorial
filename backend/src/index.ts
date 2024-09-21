import Fastify, { FastifyRequest, FastifyReply } from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Hello from Fastify and Prisma and Nextjs!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
