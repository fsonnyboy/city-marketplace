import { prisma } from "../lib/prisma";


async function main() {
  const cities = [
    { name: "Calbayog City", slug: "calbayog-city" },
    { name: "Tacloban City", slug: "tacloban-city" },
    { name: "Catarman City", slug: "catarman-city" },
    { name: "Sta. Margarita Municipality", slug: "sta-margarita-municipality" },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
  }

  console.log("✅ Cities seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
