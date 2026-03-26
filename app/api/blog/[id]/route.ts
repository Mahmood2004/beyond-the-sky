import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/middleware/auth";
import { requirePermission, hasPermission } from "@/lib/middleware/roles";

interface Params {
  params: { id: string };
}

// GET single blog
export async function GET(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();

  const blog = await prisma.blog.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  const canViewAll = user && hasPermission(user, "blog.viewAll");

  if (!blog.isPublished && !canViewAll) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(blog);
}

// PATCH blog
export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const blog = await prisma.blog.findUnique({
    where: { id: params.id },
  });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  const isAuthor = blog.authorId === user.id;
  const canUpdate = hasPermission(user, "blog.update");

  if (!isAuthor && !canUpdate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updatedBlog = await prisma.blog.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(updatedBlog);
}

// DELETE blog
export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const blog = await prisma.blog.findUnique({
    where: { id: params.id },
  });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  const isAuthor = blog.authorId === user.id;
  const canDelete = hasPermission(user, "blog.delete");

  if (!isAuthor && !canDelete) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.blog.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Blog deleted" });
}
