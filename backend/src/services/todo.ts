import { CreateTodoRequest } from "../schemas/todo";
import prisma from "../utils/prisma";

export const getTodoList = async ({
  offset,
  limit,
}: {
  offset?: number;
  limit?: number;
}) => {
  return await prisma.todo.findMany({
    skip: offset,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const createTodo = async ({ title }: CreateTodoRequest) => {
  return await prisma.todo.create({
    data: {
      title,
      status: "todo",
    },
  });
};
