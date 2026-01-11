import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const prompts = [
    { title: "The moment I knew she was special…", helperText: "One moment. One sentence. Make it count.", sortOrder: 1 },
    { title: "A place I’ll always associate with her…", helperText: "A city, a street, a café, a bench.", sortOrder: 2 },
    { title: "What I admire most about her…", helperText: "The quality that defines her.", sortOrder: 3 },
    { title: "The funniest thing she ever did…", helperText: "Let it be cinematic.", sortOrder: 4 },
  ];

  for (const p of prompts) {
    await prisma.prompt.upsert({
      where: { title: p.title },
      update: {},
      create: p,
    });
  }

  const existing = await prisma.columnEntry.findFirst();
  if (!existing) {
    await prisma.columnEntry.create({
      data: {
        title: "On the kind of woman a city remembers",
        body:
          "Some people walk through life like a passing headline.\n" +
          "And then there are the ones who change the atmosphere in a room.\n\n" +
          "This is a place for the moments, the witnesses, and the quiet proof.\n" +
          "Because the truth is: you don’t measure a woman by the years.\n" +
          "You measure her by the lives she leaves brighter.",
        isPublished: true,
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
