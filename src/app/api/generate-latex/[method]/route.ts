import { NextResponse, NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { method: string } }
) {
  const { method } = await params;
  switch (method) {
    case "pdf": {
      return NextResponse.json({ method });
    }
    case "manual": {
      return NextResponse.json({ method });
    }
    case "template": {
      return NextResponse.json({ method });
    }
    case "linkedin": {
      return NextResponse.json({ method });
    }
  }

  return NextResponse.json({ hi: "hi" });
}
