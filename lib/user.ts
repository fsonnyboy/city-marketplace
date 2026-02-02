import { prisma } from "./prisma";

export async function getUser(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        cityId: true,
        avatarUrl: true,
        city: {
            select: {
            id: true,
            name: true,
            slug: true,
            },
        },
        role: true,
        isVerified: true,
        rating: true,
        ratingCount: true,
        createdAt: true,
        updatedAt: true,
        },
    });
}