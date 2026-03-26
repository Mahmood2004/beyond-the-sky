import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";

// CREATE project interest submission
export async function POST(req: NextRequest) {
  const authUser = await requireAuth(req);
  if (authUser instanceof NextResponse) {
    return authUser;
  }

  try {
    const body = await req.json();

    const { projectId, message, subject } = body;

    const submission = await prisma.submission.create({
      data: {
        userId: authUser.id,
        projectId,
        name: authUser.name,
        email: authUser.email,
        subject,
        message,
        type: "PROJECT_INTEREST",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to submit project interest" },
      { status: 500 },
    );
  }
}
