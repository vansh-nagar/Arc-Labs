import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { newPermission, projectId } = await req.json();

    if (newPermission === undefined) {
      return NextResponse.json(
        { error: "Missing newPermission" },
        { status: 400 }
      );
    }
    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: { linkPermissionType: newPermission },
    });

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Permission updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
