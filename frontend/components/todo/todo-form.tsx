"use client";

import { useState, useTransition } from "react";

import { fw } from "@/lib/fetch";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const TodoForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await fw.post("/todos", { title });
        setTitle("");
        router.refresh();
      } catch (error) {}
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-lg">Todo List</h1>
      <Input
        placeholder="What needs to be done"
        className=""
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
      />
      <Button className="me-4 ms-auto block" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default TodoForm;
