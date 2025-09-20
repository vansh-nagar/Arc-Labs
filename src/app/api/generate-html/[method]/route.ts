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
              content: `Using the information below, generate a **resume in plain HTML** with **all CSS inlined** using style attributes. 
Include sections for contact info, summary, skills, experience, education, and projects. 
Do not include class names, React JSX, or TSX syntax. Use only standard HTML tags with inline style attributes. Do not wrap the output in markdown or any code blocks.

Candidate Data:
${prompt}

Template for reference (ignore classes, just follow the structure and styling):
<div style="max-width: 768px; margin: 2rem auto; background-color: #fff; padding: 2rem; font-family: sans-serif;">
  <!-- Header -->
  <div style="margin-bottom: 1.5rem;">
    <h1 style="font-size: 2.25rem; font-weight: 700; text-transform: uppercase;">
      John <span style="font-weight: 300;">Doe</span>
    </h1>
    <div style="color: #6b7280; margin-top: 0.5rem;">
      <span>Email:</span> john.doe@gmail.com 
      <span style="margin: 0 0.5rem; border-left: 1px solid #9ca3af; height: 1rem; display: inline-block;"></span>
      <span>Phone:</span> 111-222-3333
    </div>
    <p style="margin-top: 1rem;">
      <span style="font-weight: 600; text-decoration: underline;">Front-End Developer</span> –  
      I am a front-end developer with 3+ years of experience writing HTML, CSS and JS.
    </p>
  </div>
  
  <!-- Experience -->
  <!-- Add experience entries here, each with inline styles similar to the header -->

  <!-- Education -->
  <!-- Add education entries here, each with inline styles -->

  <!-- Projects -->
  <!-- Add projects entries here, each with inline styles -->

  <!-- Skills -->
  <!-- Add skills entries here, each with inline styles -->

  <!-- Interests -->
  <!-- Add interests entries here, each with inline styles -->
</div>

Output only the final HTML with all styles inlined in style attributes. No shadows, no border-radius, no class names, and do not use markdown or code blocks.`,
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
