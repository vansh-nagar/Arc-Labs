import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const cachedProjects = await redis.get(`user:${email}:projects`);
    if (cachedProjects) {
      return NextResponse.json(
        {
          message: "Projects fetched from cache",
          projects: JSON.parse(cachedProjects),
        },
        { status: 200 }
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
