import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

// MARK submission as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canUpdate = hasPermission(user, "submission.update");
  if (!canUpdate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const updated = await prisma.submission.update({
      where: { id: params.id },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 },
    );
  }
}
