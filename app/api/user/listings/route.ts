import { createUserListing, getUserListings } from "@/lib/listings";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
  
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 400 }
      );
    }
    const user = await getUser(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
  
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const status = (searchParams.get("status") as "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED") ?? "ACTIVE";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10), 0);
  
    try {
      const listings = await getUserListings({
        userId,
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

export async function POST(request: NextRequest) {
  const body = await request.json();

  
  if (!body.userId) {
    return NextResponse.json(
      { error: "User is required" },
      { status: 400 }
    );
  }

  try {
    const listing = await createUserListing(body);
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Failed to create listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}