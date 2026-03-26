import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";

export async function POST(req: NextRequest) {
  const authUser = await requireAuth(req);

  if (authUser instanceof NextResponse) {
    return authUser;
  }

  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
