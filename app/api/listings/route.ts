import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/listings";

/**
 * GET /api/listings
 * Returns listings for a specific city only.
 * cityId is REQUIRED - enforces city-based marketplace.
 *
 * Query params:
 * - cityId (required): The city UUID to scope listings to
 * - categoryId (optional): Filter by category
 * - status (optional): ACTIVE | SOLD | EXPIRED | REMOVED (default: ACTIVE)
 * - limit (optional): Max results (default: 20)
 * - offset (optional): Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cityId = searchParams.get("cityId");

  if (!cityId) {
    return NextResponse.json(
      { error: "cityId is required. Listings are scoped by city." },
      { status: 400 }
    );
  }

  const categoryId = searchParams.get("categoryId") ?? undefined;
  const status = (searchParams.get("status") as "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED") ?? "ACTIVE";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10), 0);

  try {
    const listings = await getListings({
      cityId,
      status,
      categoryId,
      limit,
      offset,
    });
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
