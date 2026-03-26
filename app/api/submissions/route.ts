import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

// GET all submissions (for dashboard)
export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canView = hasPermission(user, "submission.view");
  if (!canView) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const submissions = await prisma.submission.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Failed to fetch submissions", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
