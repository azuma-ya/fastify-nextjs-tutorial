import { fw } from "@/lib/fetch";

export default async function Home() {
  const { data } = await fw.get<{ message: string }>("/");

  return <div>{data.message}</div>;
}
