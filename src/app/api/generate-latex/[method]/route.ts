import { NextResponse, NextRequest } from "next/server";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export const runtime = "edge"; // or "nodejs" if you want Node

export async function POST(
  req: NextRequest,
  { params }: { params: { method: string } }
) {
  const { method } = await params;
  switch (method) {
    case "pdf": {
      try {
        const formData = await req.formData();
        const data = formData.get("data") as string;
        const file = formData.get("file") as File;
        console.log(JSON.parse(data), file);

        return NextResponse.json({ file });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }
    case "manual": {
      try {
        const data = await req.json();
        const { text } = await generateText({
          model: groq("openai/gpt-oss-120b"),
          prompt: [
            {
              role: "user",
              content: `Using the information below, generate a complete HTML page with embedded CSS for a résumé in a clean, professional style. 
              Output valid, semantic HTML and CSS that can be rendered directly in a browser and converted to PDF. 
              Ensure all special characters are escaped properly. 
              Include clearly marked sections for contact info, summary, skills, experience, education, and projects.

              Candidate Data:
              ${JSON.stringify(data, null, 2)}`,
            },
          ],
        });
        return NextResponse.json({ text }, { status: 200 });
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
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
