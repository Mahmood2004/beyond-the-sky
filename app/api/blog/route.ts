import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/middleware/auth";
import { requirePermission, hasPermission } from "@/lib/middleware/roles";

// GET all blogs
export async function GET() {
  const user = await getAuthUser();

  const canViewAll = user && hasPermission(user, "blog.viewAll");

  const blogs = await prisma.blog.findMany({
    where: canViewAll ? {} : { isPublished: true },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(blogs);
}

// POST a new blog
export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const check = requirePermission(user, "blog.create");
  if (check) return check;

  try {
    const body = await req.json();
    const { title, category, excerpt, content, bannerURL, isPublished } = body;

    const blog = await prisma.blog.create({
      data: {
        title,
        category,
        excerpt,
        content,
        bannerURL,
        isPublished,
        authorId: user.id,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 },
    );
  }
}
