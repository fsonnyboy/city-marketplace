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
          name: true,
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
          name: true,
          avatarUrl: true,
          rating: true,
          ratingCount: true,
        },
      },
    },
  });
}
