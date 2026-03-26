import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

import bcrypt from "bcryptjs";

// GET all users
export async function GET(req: NextRequest) {
  let user = null;

  try {
    const authResult = await requireAuth(req);
    if (!(authResult instanceof NextResponse)) {
      user = authResult;
    }
  } catch {
    user = null;
  }

  const canViewAll = user && hasPermission(user, "user.viewAll");

  if (canViewAll) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        permissions: { select: { permission: true } },
      },
    });

    return NextResponse.json(users);
  }

  const users = await prisma.user.findMany({
    select: {
      name: true,
      image: true,
    },
  });

  return NextResponse.json(users);
}

// POST new user
export async function POST(req: NextRequest) {
  const authUser = await requireAuth(req);
  if (authUser instanceof NextResponse) return authUser;

  const canCreateUser = hasPermission(authUser, "user.create");
  if (!canCreateUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, email, password, image, permissions = [] } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password, image },
  });

  if (permissions.length > 0) {
    const permissionData = permissions.map((perm: string) => ({
      userId: newUser.id,
      permission: perm,
    }));

    await prisma.userPermission.createMany({
      data: permissionData,
      skipDuplicates: true,
    });
  }

  return NextResponse.json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    image: newUser.image,
    createdAt: newUser.createdAt,
    permissions,
  });
}
