import { NextResponse, NextRequest } from "next/server";
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export const runtime = "edge"; // or "nodejs" if you want Node

export async function POST(
  req: NextRequest,
  { params }: { params: { method: string } }
) {
  const { method } = params;
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
Make the layout **clean, professional, and compact** like a modern corporate resume. 
Use subtle colors for section headers (#333 for main text, #555 for subtext), a sans-serif font, slightly smaller font sizes, and balanced spacing.  

When writing sections, make them **descriptive and achievement-focused**:
- For Experience: use action verbs, quantify achievements where possible, mention technologies used.
- For Projects: explain purpose, features, technologies, and impact.
- For Skills: highlight proficiency or level.
- For Summary: write a 2–3 sentence professional summary that highlights strengths, experience, and goals.

Include these sections if data exists: Contact Info, Summary, Skills, Experience, Education, Projects. 
Use only standard HTML tags with inline style attributes. 
Do not use class names, React JSX, or TSX syntax. 
Do not wrap the output in markdown or code blocks. 
Do not add shadows or rounded corners.  

**Important for editing later:**
- Wrap each section in identifiable HTML comments so it can be targeted individually:
  <!-- SECTION: HEADER -->
  <!-- SECTION: SUMMARY -->
  <!-- SECTION: SKILLS -->
  <!-- SECTION: EXPERIENCE -->
  <!-- SECTION: EDUCATION -->
  <!-- SECTION: PROJECTS -->
- Make each section descriptive and achievement-oriented, using metrics, technologies, and outcomes wherever applicable.

Candidate Data:
${prompt}

Template reference for styling and structure (ignore classes):
<div style="max-width:700px; margin:1.5rem auto; background-color:#fff; padding:1.5rem; font-family:Arial,sans-serif; font-size:14px; line-height:1.5; color:#333;">
  <!-- SECTION: HEADER -->
  <div style="margin-bottom:1rem; border-bottom:1px solid #ccc; padding-bottom:0.5rem;">
    <h1 style="font-size:1.75rem; font-weight:700; margin:0;">John <span style="font-weight:400;">Doe</span></h1>
    <div style="color:#555; font-size:13px; margin-top:0.25rem;">
      <span>Email:</span> john.doe@gmail.com 
      <span style="margin:0 0.5rem; border-left:1px solid #999; height:0.75rem; display:inline-block;"></span>
      <span>Phone:</span> 111-222-3333
    </div>
    <p style="margin-top:0.5rem; font-size:13px;">
      <span style="font-weight:600;">Front-End Developer</span> – Creative and detail-oriented developer with 4+ years’ experience building responsive, user-friendly websites and web apps.
    </p>
  </div>

  <!-- SECTION: EXPERIENCE -->
  <!-- Add experience entries here, each with inline styles similar to the header, making them descriptive and achievement-focused -->

  <!-- SECTION: EDUCATION -->
  <!-- Add education entries here with inline styles, include degree, institution, dates, and notable achievements -->

  <!-- SECTION: PROJECTS -->
  <!-- Add projects entries here with inline styles, describing purpose, technologies, and impact -->

  <!-- SECTION: SKILLS -->
  <!-- Add skills entries here with inline styles, highlight proficiency or level -->
</div>

              Output only the final HTML with all styles inlined in style attributes. Wrap each section with the HTML comments as specified so that sections can be individually edited later.`,
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
