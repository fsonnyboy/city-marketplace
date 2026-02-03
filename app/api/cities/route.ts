import { NextResponse } from "next/server";
import { getCities } from "@/lib/city";

export async function GET() {
  try {
    const cities = getCities()
    return NextResponse.json(cities);
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
