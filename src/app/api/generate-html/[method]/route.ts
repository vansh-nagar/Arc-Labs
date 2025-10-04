import { NextResponse, NextRequest } from "next/server";
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import pdfParse from "pdf-parse-new";

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
              content: `Using the information below, generate a **resume in plain HTML** with **all CSS inlined** using style attributes. 
Make the layout **clean, professional, and compact** like a modern corporate resume. 
resume_styles:
  font_family: "Arial, Helvetica, sans-serif"
  colors:
    main_text: "#333"
    subtext: "#555"
    separator: "#ddd"
    accent: "#0073b1"  # optional subtle accent for headings or links
  spacing:
    section_margin_bottom: "0.8rem"  # slightly smaller for compact look
    line_height_default: 1.4
    paragraph_margin_bottom: "0.5rem"
  elements:
    name:
      font_size: 32px
      color: "#333"
      font_weight: 700
      line_height: 1.2
      notes: "Primary focal point, large but not overpowering make last name lighter weight"
    contact_info:
      font_size: 12-13px
      color: "#555"
      font_weight: 400
      line_height: 1.3
      notes: "Compact, clean, and subtle"
    section_headers:
      font_size: 17-18px
      color: "#333"
      font_weight: 700
      line_height: 1.25
      notes: "Bold, clean separators, slightly smaller for modern look"
    company_project_name:
      font_size: 15-16px
      color: "#333"
      font_weight: 600
      line_height: 1.3
      notes: "Slightly larger than descriptions, premium feel"
    dates_locations:
      font_size: 12-13px
      color: "#555"
      font_weight: 400
      line_height: 1.25
      notes: "Compact subtext; display dates on the right and headings/titles on the left for a clean, justified layout."
    bullet_points:
      font_size: 14-15px
      color: "#333"
      font_weight: 400
      line_height: 1.4
      notes: "Tighter spacing, clear achievement focus"
    skills_list:
      font_size: 14px
      color: "#333"
      font_weight: 400
      line_height: 1.5
      notes: "put all skills in bullet points"
    summary_text:
      font_size: 14-15px
      color: "#333"
      font_weight: 400
      line_height: 1.4
      notes: "Concise, professional, easy to read"
    education_details:
      font_size: 14-15px
      color: "#333"
      font_weight: 400
      line_height: 1.3
      notes: "Tighter spacing, compact, professional"
    bullet_points:
      notes: "Use anywhere bullet points are written"
      bullet_symbol: "•"
      use_ul_li: true  # AI should generate <ul> + <li> instead of plain <p>

      
  separators:
    section_border: "1px solid #ddd"  # very subtle line between sections
    section_padding_bottom: "0.5rem"
  ats_friendly_tips:
    - "Keep colors subtle (#333 for main, #555 for secondary)."
    - "Use plain text in descriptions; avoid images or fancy layouts."
    - "Include measurable achievements and relevant keywords in each section."
    - "Keep spacing consistent, avoid extra line breaks."
    - "Use bullet points for easy parsing by ATS."


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
+ give each section a unique id attribute matching the section name so it can be selected programmatically later:
+ <div id="page">...</div>
+ <div id="header-section">...</div>
+ <div id="summary-section">...</div>
+ <div id="skills-section">...</div>
+ <div id="experience-section">...</div>
+ <div id="education-section">...</div>
+ <div id="projects-section">...</div>

- Make each section descriptive and achievement-oriented, using metrics, technologies, and outcomes wherever applicable.
- Use bullet points (•) wherever they improve clarity — especially for achievements, responsibilities, skills, and project details — while keeping descriptions concise and easy to scan.

Candidate Data:
${prompt}

            Template reference for styling and structure (ignore classes):
            <div id="page" style="max-width:700px; margin:0rem auto; background-color:#fff; padding:0 1rem; font-family:Arial,sans-serif; font-size:14px; line-height:1.5; color:#333;">
              <!-- SECTION: HEADER -->
              <div>
                <h1>Doe</span></h1>
                <div>
                  <span>Email:</span> john.doe@gmail.com 
                  <span></span>
                  <span>Phone:</span> 111-222-3333
                </div>
                <p style="margin-top:0.5rem; font-size:13px;">
                  <span>Front-End Developer</span> – Creative and detail-oriented developer with 4+ years’ experience building responsive, user-friendly websites and web apps.
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
      console.log("Linkedin method called");
    }
  }

  return NextResponse.json({ hi: "hi" });
}
