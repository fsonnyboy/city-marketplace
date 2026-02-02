import { Condition } from "@/generated/prisma/client";
import { prisma } from "./prisma";

/**
 * City-scoped listing queries.
 * All listing fetches MUST include cityId to enforce city-based marketplace.
 */

export type ListingStatus = "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED";

export type GetListingsOptions = {
  cityId: string;
  status?: ListingStatus;
  categoryId?: string;
  limit?: number;
  offset?: number;
};

/**
 * Fetch listings for a specific city only.
 * cityId is required - listings are never returned without city scope.
 */
export async function getListings({
  cityId,
  status = "ACTIVE",
  categoryId,
  limit = 20,
  offset = 0,
}: GetListingsOptions) {
  return prisma.listing.findMany({
    where: {
      cityId,
      status,
      ...(categoryId && { categoryId }),
    },
    include: {
      images: true,
      category: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          rating: true,
          ratingCount: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

/**
 * Fetch a single listing by id, only if it belongs to the given city.
 * Returns null if the listing does not exist or belongs to another city.
 */
export async function getListingById(listingId: string, cityId: string) {
  return prisma.listing.findFirst({
    where: {
      id: listingId,
      cityId,
    },
    include: {
      images: true,
      category: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          rating: true,
          ratingCount: true,
        },
      },
    },
  });
}

export async function getUserListings({
  userId,
  categoryId,
  status = "ACTIVE",
  limit = 20,
  offset = 0,
}: {
  userId: string;
  categoryId?: string;
  status?: ListingStatus;
  limit?: number;
  offset?: number;
}) {
  return prisma.listing.findMany({
    where: {
      userId,
      status,
      ...(categoryId && { categoryId }),
    },
    include: {
      images: true,
      category: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          rating: true,
          ratingCount: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getUserListingById(listingId: string, userId: string) {
  return prisma.listing.findFirst({
    where: {
      id: listingId,
      userId,
    },
    include: {
      images: true,
      category: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          rating: true,
          ratingCount: true,
        },
      },
    },
  });
}

export async function createUserListing(
  body: { 
    title: string;
    description: string;
    price: number;
    negotiable: boolean;
    condition: string;
    status: string;
    categoryId: string;
    userId: string;
    cityId: string;
  }
) {

  return prisma.listing.create({
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      negotiable: body.negotiable,
      condition: body.condition as Condition,
      status: body.status as ListingStatus,
      categoryId: body.categoryId,
      userId: body.userId,
      cityId: body.cityId,
    },
  });
}

export async function updateUserListing(
  listingId: string, 
  body: { 
    title: string;
    description: string;
    price: number;
    negotiable: boolean;
    condition: string;
    status: string;
    categoryId: string;
    userId: string;
    cityId: string;
  },
) {

  return prisma.listing.update({
    where: { id: listingId },
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      negotiable: body.negotiable,
      condition: body.condition as Condition,
      status: body.status as ListingStatus,
      categoryId: body.categoryId,
      userId: body.userId,
      cityId: body.cityId,
    },
  });
}

export async function deleteUserListing(listingId: string, userId: string) {

  return prisma.listing.delete({
    where: { id: listingId },
  });
}