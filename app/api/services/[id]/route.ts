import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

// GET one service
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 },
    );
  }
}

// UPDATE service
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canUpdate = hasPermission(user, "service.update");
  if (!canUpdate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}

// DELETE service
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canDelete = hasPermission(user, "service.delete");
  if (!canDelete) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
