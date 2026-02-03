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

export async function getCity(id: string) {
    return await prisma.city.findFirst({
        where: { id, isActive: true },
    });
}