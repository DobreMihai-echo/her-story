import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import EditMemoryClient from "./ui";

export default async function EditMemoryPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin");

  const { id } = await params;

  // If the route was called without an id, go back to studio
  if (!id || typeof id !== "string") {
    redirect("/admin/studio");
  }

  const memory = await prisma.memory.findUnique({
    where: { id },
    include: { media: true, prompt: true },
  });

  if (!memory) {
    redirect("/admin/studio");
  }

  const prompts = await prisma.prompt.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  return <EditMemoryClient memory={memory} prompts={prompts} />;
}
