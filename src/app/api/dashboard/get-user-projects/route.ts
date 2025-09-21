import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

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

    const userProjects = await prisma.projects.findMany({
      where: {
        userId: foundUser?.id,
      },
    });

    if (!userProjects) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Projects fetched successfully", projects: userProjects },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
