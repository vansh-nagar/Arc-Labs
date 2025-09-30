import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { newExpiry, projectId } = await req.json();

    if (!projectId || !newExpiry) {
      return NextResponse.json(
        { error: "Missing project ID or new expiry" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: { linkExpiresAt: newExpiry },
    });

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Failed to update project" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Link expiry updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set link expiry" },
      { status: 500 }
    );
  }
}
