import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { projectId } = await request.json();

  const update = await prisma.projects.update({
    where: { id: projectId },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json(
    { message: "View count updated", data: update.viewCount },
    { status: 200 }
  );
}
