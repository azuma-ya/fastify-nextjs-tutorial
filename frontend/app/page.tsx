import TodoForm from "@/components/todo/todo-form";
import TodoList from "@/components/todo/todo-list";
import { fw } from "@/lib/fetch";
import { TodoType } from "@/types/todo";

export default async function Home() {
  const { data } = await fw.get<TodoType[]>("/todos", { cache: "no-cache" });

  return (
    <div className="max-w-2xl mx-auto my-auto mt-32 space-y-4 container">
      <TodoForm />
      <TodoList data={data} />
    </div>
  );
}
