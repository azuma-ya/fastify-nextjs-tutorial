import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(20),
  status: z.enum(["todo", "doing", "done", "cancel"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const searchTodoListQuerySchema = z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
});
export const todoListSchema = z.array(todoSchema);
export const createTodoBodySchema = todoSchema.pick({ title: true });
export const responseSchema = z.object({
  message: z.string(),
});

export type GetTodoListRequest = z.infer<typeof searchTodoListQuerySchema>;
export type CreateTodoRequest = z.infer<typeof createTodoBodySchema>;
export type GetTodoListResponse = z.infer<typeof todoListSchema>;

export const todoSchemas = {
  searchTodoListQuerySchema,
  createTodoBodySchema,
  todoListSchema,
  todoSchema,
  responseSchema,
};
