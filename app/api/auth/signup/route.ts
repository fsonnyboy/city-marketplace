import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, createSession } from "@/lib/auth";
import { createUSer, getUserByEmail, getUserByPhone } from "@/lib/user";
import { getCity } from "@/lib/city";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((v) => normalizePhone(v).length >= 10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  cityId: z.string().min(1, "Please select your city"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, password, cityId } = parsed.data;
    const normalizedPhone = normalizePhone(phone);

    const existingByEmail = await getUserByEmail(email)

    if (existingByEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const existingByPhone = await getUserByPhone(phone)

    if (existingByPhone) {
      return NextResponse.json(
        { error: "An account with this phone number already exists" },
        { status: 409 }
      );
    }

    const city = await getCity(cityId)

    if (!city) {
      return NextResponse.json(
        { error: "Invalid city selected" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await createUSer(firstName, lastName, email, phone, passwordHash, cityId)

    const displayName = `${user.firstName} ${user.lastName}`;
    await createSession({
      userId: user.id,
      cityId: user.cityId,
      email: user.email,
      name: displayName,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: displayName,
        email: user.email,
        cityId: user.cityId,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
