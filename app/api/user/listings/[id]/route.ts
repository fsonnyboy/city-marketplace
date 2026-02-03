import { getUserListingById, updateUserListing } from "@/lib/listings";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
  
    if (!id) {
        return NextResponse.json(
            { error: "Listing ID is required" },
            { status: 400 }
        );
    }

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

    try {
      const listing = await getUserListingById(id, user.id);

      return NextResponse.json(listing);
    } catch (error) {
      console.error("Failed to fetch listing:", error);
      return NextResponse.json(
        { error: "Failed to fetch listing" },
        { status: 500 }
      );
    }
}

export  async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string}>}) {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.userId) {
        return NextResponse.json(
            { error: "User is required" },
            { status: 400 }
        );
    }

    const listing = await getUserListingById(id, body.userId)

    if (!listing) {
        return NextResponse.json(
            { error: "Listing not found" },
            { status: 404 }
        );
    }

    if (listing.cityId !== body.cityId) {
        return NextResponse.json(
            { error: "Listing does not belong to user's city" },
            { status: 500 }
        );
    }

    try {
        const updatedListing = await updateUserListing(listing.id, body)
        return NextResponse.json(updatedListing)
    } catch (error) {
        console.error("Failed to update listing:", error);
        return NextResponse.json(
            { error: "Failed to update listing" },
            { status: 500 }
        );
    }

}

export  async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string}>}) {
    const { id } = await params;
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
  
    if (!id) {
        return NextResponse.json(
            { error: "Listing ID is required" },
            { status: 400 }
        );
    }

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

    const listing = await getUserListingById(id, user.id)

    if (!listing) {
        return NextResponse.json(
            { error: "Listing not found" },
            { status: 404 }
        );
    }

    if (listing.cityId !== user.cityId) {
        return NextResponse.json(
            { error: "Listing does not belong to user's city" },
            { status: 500 }
        );
    }

    try {
        const updatedListing = await updateUserListing(listing.id, {...body, userId: user.id, cityId: user.cityId })
        return NextResponse.json(updatedListing)
    } catch (error) {
        console.error("Failed to update listing:", error);
        return NextResponse.json(
            { error: "Failed to update listing" },
            { status: 500 }
        );
    }

}