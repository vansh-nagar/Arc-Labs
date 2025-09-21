import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { projectId, lockState } = await request.json();
    if (!projectId || lockState === undefined) {
      return NextResponse.json(
        { error: "Project ID and lock state are required." },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: { locked: lockState },
    });

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Project lock state updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling project lock state:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
