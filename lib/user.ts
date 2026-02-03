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

export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            cityId: true,
            passwordHash: true,
            city: { select: { id: true, name: true, slug: true } },
        },
    });
}

export async function getUserByPhone(phone: string) {
    return await prisma.user.findUnique({
        where: { phone },
    });
}

export async function createUSer(
    firstName: string, 
    lastName: string, 
    email: string, 
    phone: string, 
    passwordHash: string,
    cityId: string
) {
    return await prisma.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
          phone,
          passwordHash,
          cityId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          cityId: true,
        },
    });
}