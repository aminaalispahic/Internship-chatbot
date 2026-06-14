import { prisma } from "../prisma";

const DNEVNI_LIMIT = 800; // Groq llama-3.3-70b-versatile: 1000 RPD, margina za sigurnost

function danas(): string {
  return new Date().toISOString().split("T")[0];
}

export async function checkAndIncrementUsage(): Promise<boolean> {
  const datum = danas();

  return await prisma.$transaction(async (tx) => {
    const usage = await tx.apiUsage.findUnique({ where: { datum } });
    const trenutni = usage?.brojac || 0;

    if (trenutni >= DNEVNI_LIMIT) return false;

    await tx.apiUsage.upsert({
      where: { datum },
      create: { datum, brojac: 1 },
      update: { brojac: { increment: 1 } },
    });

    return true;
  });
}