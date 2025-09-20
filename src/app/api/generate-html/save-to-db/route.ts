import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { htmlContent, email } = await req.json();

    if (!htmlContent || !email) {
      return NextResponse.json(
        { error: "Missing htmlContent or email" },
        { status: 400 }
      );
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const createdProject = await prisma.projects.create({
      data: {
        userId: foundUser.id,
        html: JSON.stringify(htmlContent),
        name: `Project ${new Date().toISOString()}`,
      },
    });

    if (!createdProject) {
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Project saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}
