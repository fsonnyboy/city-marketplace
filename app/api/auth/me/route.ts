import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUser } from "@/lib/user";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await getUser(session.userId)

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      city: user.city,
    },
  });
}
