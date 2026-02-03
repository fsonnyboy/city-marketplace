import { prisma } from "./prisma";

export async function getCities() {
    return await prisma.city.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
}