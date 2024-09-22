import { FastifyInstance } from "fastify";

import { createTodoHandler, getTodoListHandler } from "../controllers/todo";

export const createTodoRoutes = async (app: FastifyInstance) => {
  app.zod.get(
    "/todos",
    {
      operationId: "getTodoList",
      querystring: "searchTodoListQuerySchema",
      response: {
        200: {
          description: "TodoList取得成功",
          key: "todoListSchema",
        },
      },
      tags: ["Todo"],
    },
    getTodoListHandler
  );
  app.zod.post(
    "/todos",
    {
      operationId: "createTodo",
      body: "createTodoBodySchema",
      response: {
        200: {
          description: "Todo作成成功",
          key: "todoSchema",
        },
        500: {
          description: "Todo作成失敗",
          key: "responseSchema",
        },
      },
      tags: ["Todo"],
    },
    createTodoHandler
  );
};
