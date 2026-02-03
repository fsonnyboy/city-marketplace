import { prisma } from "../lib/prisma";
import { faker } from '@faker-js/faker';

async function main() {
  const cities = [
    { name: "Calbayog City", slug: "calbayog-city" },
    { name: "Tacloban City", slug: "tacloban-city" },
    { name: "Catarman City", slug: "catarman-city" },
    { name: "Sta. Margarita Municipality", slug: "sta-margarita-municipality" },
  ];

  const categoriesData = [
    {
      name: "Mobile Phones",
      slug: "mobile-phones",
      icon: "smartphone",
    },
    {
      name: "Electronics",
      slug: "electronics",
      icon: "tv",
    },
    {
      name: "Vehicles",
      slug: "vehicles",
      icon: "car",
    },
    {
      name: "Motorcycles",
      slug: "motorcycles",
      icon: "bike",
    },
    {
      name: "Home & Furniture",
      slug: "home-furniture",
      icon: "sofa",
    },
    {
      name: "Fashion",
      slug: "fashion",
      icon: "tshirt",
    },
    {
      name: "Appliances",
      slug: "appliances",
      icon: "washing-machine",
    },
    {
      name: "Computers",
      slug: "computers",
      icon: "laptop",
    },
  ]

  await prisma.category.createMany({
    data: categoriesData,
    skipDuplicates: true, // important for re-runs
  })

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: '6056887a-2c19-4c41-b575-e2df8db8f210' },
    include: {
      city: true
    }
  })

  const categories = await prisma.category.findMany()

  const getCategoryId = (slug: string) => {
    const category = categories.find((c) => c.slug === slug)
    if (!category) throw new Error(`Category ${slug} not found`)
    return category.id
  }
  

  await prisma.listing.createMany({
    data: [
      {
        title: "iPhone 13 Pro 256GB",
        description: "Good condition, no issues. Meet-up only.",
        price: 28000,
        negotiable: true,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("mobile-phones"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        title: "Honda Click 125",
        description: "Fresh unit, complete papers.",
        price: 62000,
        negotiable: false,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("motorcycles"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Wooden Dining Table Set",
        description: "6-seater, solid wood.",
        price: 15000,
        negotiable: true,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("home-furniture"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Samsung Galaxy S22 Ultra",
        description: "Original unit, smooth performance, no history of repair.",
        price: 32000,
        negotiable: true,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("mobile-phones"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Dell Inspiron Laptop i5",
        description: "Good for work or online classes. Complete charger.",
        price: 25000,
        negotiable: true,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("computers"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Refrigerator – 2 Door",
        description: "Still cold, no issues. Rush sale.",
        price: 9000,
        negotiable: true,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("appliances"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Toyota Vios 2015 Manual",
        description: "Registered, well maintained, daily use.",
        price: 320000,
        negotiable: false,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("vehicles"),
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Branded Jackets Bundle",
        description: "Take all. Good condition. Decluttering.",
        price: 1800,
        negotiable: true,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("fashion"),
        expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Office Table and Chair Set",
        description: "Perfect for WFH setup. Slight scratches only.",
        price: 4500,
        negotiable: false,
        condition: "USED",
        status: "ACTIVE",
        userId: user?.id as string,
        cityId: user?.cityId as string,
        categoryId: getCategoryId("home-furniture"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  const listings = await prisma.listing.findMany()

  for (const listing of listings) {
    for (let index = 0; index < 5; index++) {
      await prisma.listingImage.create({
        data: {
          url: faker.image.url(),
          listingId: listing.id
        }
      })
    }
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
