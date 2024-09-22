import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTodoRequest, GetTodoListRequest } from "../schemas/todo";
import { createTodo, getTodoList } from "../services/todo";

export const getTodoListHandler = async (
  req: FastifyRequest<{ Querystring: GetTodoListRequest }>,
  rep: FastifyReply
) => {
  const { offset, limit } = req.query;

  const todoList = await getTodoList({ offset, limit });

  rep.code(200).send(todoList);
};

export const createTodoHandler = async (
  req: FastifyRequest<{ Body: CreateTodoRequest }>,
  rep: FastifyReply
) => {
  try {
    const { title } = req.body;

    const todo = await createTodo({ title });

    rep.code(200).send(todo);
  } catch (err) {
    rep.code(500).send({ message: "server 500" });
  }
};
