import { NextResponse, NextRequest } from "next/server";
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import pdfParse from "pdf-parse-new";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

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
+ give each section a unique id attribute matching the section name so it can be selected programmatically later:
+ <div id="header-section">...</div>
+ <div id="summary-section">...</div>
+ <div id="skills-section">...</div>
+ <div id="experience-section">...</div>
+ <div id="education-section">...</div>
+ <div id="projects-section">...</div>

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
      const { LinkedinUrl } = await req.json();

      if (!LinkedinUrl) {
        return NextResponse.json(
          { error: "No LinkedIn URL provided" },
          { status: 400 }
        );
      }

      let browser;
      try {
        // Launch Puppeteer
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Set User-Agent to mimic real browser
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
        );

        // Go to LinkedIn profile
        await page.goto(LinkedinUrl, { waitUntil: "networkidle2" });

        // Extract profile data
        const profile = await page.evaluate(() => {
          const name = document.querySelector("h1")?.textContent?.trim() || "";
          const headline =
            document
              .querySelector("div.text-body-medium")
              ?.textContent?.trim() || "";
          const summary =
            document
              .querySelector("section.pv-about-section p")
              ?.textContent?.trim() || "";

          const experience: Array<{ title: string; company: string }> = [];
          const expElements = document.querySelectorAll(
            "li.pv-entity__position-group-pager"
          );
          expElements.forEach((el) => {
            const title = el.querySelector("h3")?.textContent?.trim() || "";
            const company =
              el
                .querySelector("p.pv-entity__secondary-title")
                ?.textContent?.trim() || "";
            experience.push({ title, company });
          });

          return { name, headline, summary, experience };
        });

        return NextResponse.json(profile);
      } catch (err) {
        console.error(err);
        return NextResponse.json(
          { error: "Failed to fetch LinkedIn profile" },
          { status: 500 }
        );
      } finally {
        if (browser) await browser.close();
      }
    }
  }

  return NextResponse.json({ hi: "hi" });
}
