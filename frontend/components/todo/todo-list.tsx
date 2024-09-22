"use client";

import { useTransition } from "react";

import { X } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import { TodoType } from "@/types/todo";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

interface Props {
  data: TodoType[];
}

const TodoList = ({ data }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        console.log(id);
      } catch (error) {}
    });
  };

  return (
    <Table>
      <TableCaption>A list of your todos.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">status</TableHead>
          <TableHead>todo</TableHead>
          <TableHead>updatedAt</TableHead>
          <TableHead className="text-right">action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell className="">{todo.status}</TableCell>
            <TableCell className="font-medium">{todo.title}</TableCell>
            <TableCell suppressHydrationWarning className="">
              {format(todo.updatedAt, "yyyy/MM/dd HH:mm", { locale: ja })}
            </TableCell>
            <TableCell className="text-right">
              <Button size="icon" onClick={() => handleDelete(todo.id)}>
                <X className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{data?.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TodoList;
