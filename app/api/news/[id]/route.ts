import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

// GET single news
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!newsItem) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }
}

// UPDATE news
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canUpdate = hasPermission(user, "news.update");
  if (!canUpdate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const updatedNews = await prisma.news.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedNews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 },
    );
  }
}

// DELETE news
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canDelete = hasPermission(user, "news.delete");
  if (!canDelete) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.news.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "News deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 },
    );
  }
}
