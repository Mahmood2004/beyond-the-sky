import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

// GET a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canViewAll = hasPermission(user, "user.viewAll");
  const canView = hasPermission(user, "user.view");

  if (!canView && !canViewAll) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const selectedFields = canViewAll
    ? {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        permissions: { select: { permission: true } },
      }
    : { name: true, image: true };

  const targetUser = await prisma.user.findUnique({
    where: { id: params.id },
    select: selectedFields,
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(targetUser);
}

// PATCH a user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  if (!hasPermission(user, "user.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, email, image, permissions } = await req.json();

  if (email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== params.id) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: params.id },
    data: { name, email, image },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });

  if (Array.isArray(permissions)) {
    await prisma.userPermission.deleteMany({ where: { userId: params.id } });

    if (permissions.length > 0) {
      const permissionData = permissions.map((perm: string) => ({
        userId: params.id,
        permission: perm,
      }));
      await prisma.userPermission.createMany({
        data: permissionData,
        skipDuplicates: true,
      });
    }
  }

  return NextResponse.json(updatedUser);
}

// DELETE a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  if (!hasPermission(user, "user.delete")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "User deleted successfully" });
}
