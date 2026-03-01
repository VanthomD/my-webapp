import { prisma } from "../lib/prisma";

async function main() {
  await prisma.location.upsert({
    where: { code: "GENT-01" },
    update: { name: "Gent - Site 1" },
    create: { code: "GENT-01", name: "Gent - Site 1" },
  });

  await prisma.location.upsert({
    where: { code: "ANT-01" },
    update: { name: "Antwerpen - Site 1" },
    create: { code: "ANT-01", name: "Antwerpen - Site 1" },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });