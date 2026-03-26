import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// CREATE contact submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, subject, message } = body;

    const submission = await prisma.submission.create({
      data: {
        name,
        email,
        subject,
        message,
        type: "CONTACT",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
