import { NextResponse, NextRequest } from "next/server";
import { generateText } from "ai";

export async function POST(
  req: NextRequest,
  { params }: { params: { method: string } }
) {
  const { method } = await params;
  const formData = await req.formData();
  switch (method) {
    case "pdf": {
      try {
        const data = formData.get("data") as string;
        const file = formData.get("file") as File;
        console.log(JSON.parse(data), file);

        return NextResponse.json({ data, file });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
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
