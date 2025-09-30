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

    console.log(fetcherEmail);
    console.log(projectData.user.email);

    if (projectData.user.email === fetcherEmail) {
      return NextResponse.json(
        {
          isOwner: true,
          urlPermission: projectData.linkPermissionType,
          projectData: projectData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          isOwner: false,
          urlPermission: projectData.linkPermissionType,
          projectData: projectData,
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
