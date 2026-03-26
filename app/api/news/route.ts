import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

// GET all news
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }
}

// CREATE news
export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canCreate = hasPermission(user, "news.create");
  if (!canCreate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, excerpt, content, bannerURL, referenceURLs } = body;

    const newNews = await prisma.news.create({
      data: {
        title,
        excerpt,
        content,
        bannerURL,
        referenceURLs,
      },
    });

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 },
    );
  }
}
