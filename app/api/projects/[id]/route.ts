import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { hasPermission } from "@/lib/middleware/roles";

// GET single project
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// UPDATE project
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canUpdate = hasPermission(user, "project.update");
  if (!canUpdate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE project
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  const canDelete = hasPermission(user, "project.delete");
  if (!canDelete) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
