import { NextRequest, NextResponse } from "next/server";
import { getListingById } from "@/lib/listings";

/**
 * GET /api/listings/[id]
 * Returns a single listing only if it belongs to the specified city.
 * cityId is REQUIRED - prevents cross-city listing access.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cityId = request.nextUrl.searchParams.get("cityId");

  if (!cityId) {
    return NextResponse.json(
      { error: "cityId is required. Listings are scoped by city." },
      { status: 400 }
    );
  }

  try {
    const listing = await getListingById(id, cityId);

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or does not belong to this city" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}
