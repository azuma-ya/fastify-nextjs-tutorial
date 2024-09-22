import Fastify from "fastify";
import { buildJsonSchemas, FastifyZod, register } from "fastify-zod";
import { patchSchemas } from "./patch";
import { registerRoutes } from "./register";

const app = Fastify({ logger: true });

declare module "fastify" {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof patchSchemas>;
  }
}

const swaggerSetting = {
  swaggerOptions: {
    openapi: {
      info: {
        title: "API docs",
        version: "1.0.0",
      },
      servers: [
        {
          url: "/api",
          description: "Local API server",
        },
      ],
    },
  },
  swaggerUiOptions: {
    routePrefix: "/docs",
    staticCSP: true,
  },
};

const start = async () => {
  await register(app, {
    jsonSchemas: buildJsonSchemas(patchSchemas),
    ...swaggerSetting,
  });

  await registerRoutes(app);

  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
