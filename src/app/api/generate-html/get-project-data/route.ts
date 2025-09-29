import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId, fetcherEmail } = await req.json();
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }
    const projectData = await prisma.projects.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!projectData) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (projectData?.user.email === fetcherEmail) {
      console.log("user is owner");
      return NextResponse.json(
        { project: projectData, permissionType: "EDIT" },
        { status: 200 }
      );
    } else {
      console.log("user is not owner");

      return NextResponse.json(
        {
          project: projectData,
          permissionType: projectData?.linkPermissionType,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve project data" },
      { status: 500 }
    );
  }
}
