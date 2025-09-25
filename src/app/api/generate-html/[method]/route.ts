import { NextResponse, NextRequest } from "next/server";
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import pdfParse from "pdf-parse-new";

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
        if (!data || !file) {
          return NextResponse.json(
            { error: "Missing data or file" },
            { status: 400 }
          );
        }

        const { jobTitle, description } = JSON.parse(data);

        //
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        //
        const parsed = await pdfParse(buffer);

        return NextResponse.json(
          {
            parsedText: parsed.text,
            jobTitle: jobTitle,
            description: description,
          },
          { status: 200 }
        );
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
              content: `Using the candidate information provided below, generate a complete, professional resume in plain HTML with all CSS fully inlined using style attributes. The HTML must be clean, modern, and compact like a top-tier corporate resume.
                        Layout & Styling:
                        - Use a sans-serif font, subtle colors for text (#333 main, #555 subtext), slightly smaller font sizes, and balanced spacing for readability.
                        - Keep the layout professional, compact, and visually clean. Avoid shadows, rounded corners, tables, or images.
                        - All sections must have unique IDs and be wrapped in identifiable HTML comments for easy programmatic editing:
                          <!-- SECTION: HEADER --> <div id="header-section">...</div>
                          <!-- SECTION: SUMMARY --> <div id="summary-section">...</div>
                          <!-- SECTION: SKILLS --> <div id="skills-section">...</div>
                          <!-- SECTION: EXPERIENCE --> <div id="experience-section">...</div>
                          <!-- SECTION: EDUCATION --> <div id="education-section">...</div>
                          <!-- SECTION: PROJECTS --> <div id="projects-section">...</div>

                        Content Guidelines:
                        - Header/Contact Info: Name, professional title, email, phone, LinkedIn/GitHub if provided.
                        - Summary: 2–3 sentence professional overview highlighting strengths, experience, achievements, and career goals.
                        - Skills: Include hard and soft skills, highlight proficiency levels, technologies used, and relevant keywords for ATS scoring.
                        - Experience: Use action verbs, quantify results (percentages, metrics, numbers), mention technologies and tools used. Include achievements, not just responsibilities.
                        - Education: Include degree, institution, graduation year, honors, certifications.
                        - Projects: Explain purpose, scope, technologies, impact, and results. Focus on measurable outcomes.

                        Formatting & Output Rules:
                        - Use only standard HTML tags and inline style attributes; no classes, no React/JSX/TSX.
                        - Each section must be wrapped in HTML comments and have a unique ID.
                        - Use bullet points for lists, concise descriptive text, and strong action verbs.
                        - Output only the final HTML; do not include markdown, code fences, or explanations.

                        Extra Requirements for ATS & Readability:
                        - Optimize content for keyword matching with job-relevant skills.
                        - Highlight measurable achievements for each experience/project.
                        - Ensure the resume is human-readable, visually clean, and fully parseable by ATS systems.

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
