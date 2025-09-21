import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: NextResponse) {
  try {
    const { htmlContent, projectId } = await request.json();

    if (!htmlContent || !projectId) {
      return NextResponse.json(
        { error: "Missing htmlContent or projectId" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: { html: JSON.stringify(htmlContent) },
    });

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Project updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
