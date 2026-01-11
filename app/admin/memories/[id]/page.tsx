import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import EditMemoryClient from "./ui";

export default async function EditMemory({ params }: { params: { id: string } }) {
  if (!isAdmin()) redirect("/admin");

  const memory = await prisma.memory.findUnique({
    where: { id: params.id },
    include: { media: true, prompt: true },
  });
  if (!memory) redirect("/admin/studio");

  const prompts = await prisma.prompt.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }] });

  return <EditMemoryClient memory={memory} prompts={prompts} />;
}
