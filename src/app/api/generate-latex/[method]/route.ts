import { NextResponse, NextRequest } from "next/server";
import { generateText, streamText } from "ai";
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

        return NextResponse.json({ file }, { status: 200 });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }
    case "manual": {
      try {
        const { prompt } = await req.json();
        console.log("Received prompt:", prompt);
        if (!prompt) {
          console.log("No prompt provided in the request body");
          return NextResponse.json(
            { error: "No prompt provided" },
            { status: 400 }
          );
        }

        const result = streamText({
          model: groq("openai/gpt-oss-120b"),
          prompt: [
            {
              role: "user",
              content: `Using the information below, generate a **resume in HTML** using Tailwind CSS classes. 
              Include sections for contact info, summary, skills, experience, education, and projects. 
              Output only the HTML inside a <div>...</div>. Do not include React JSX or special TSX syntax.
              Candidate Data:
              ${prompt}`,
            },
          ],
        });

        return result.toUIMessageStreamResponse();
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
