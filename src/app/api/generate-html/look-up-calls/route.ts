import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

// Schema for divId
const outputSchema = z.object({
  divId: z.enum([
    "header-section",
    "summary-section",
    "skills-section",
    "experience-section",
    "education-section",
    "projects-section",
    "page",
    "not-found",
  ]),
  normalReply: z.string().describe(
    `Find the divId the user refers to. 
    - If it matches, return divId and a reply about improving that section. 
    - If off-topic or unrelated, return divId 'not-found' and a polite reply reminding help is only for resume improvement.
`
  ),
});

const updateSchema = z.object({
  updatedHtml: z
    .string()
    .describe("The updated HTML content for the specified div."),

  reply: z.string().describe("reply for the changes you made."),
  suggestions: z
    .array(z.string())
    .describe(
      "give one suggestion for further improving the resume and make it more ATS friendly"
    ),
});

export async function POST(req: NextRequest) {
  try {
    const { htmlContent, chatPrompt } = await req.json();

    if (!htmlContent || !chatPrompt) {
      return NextResponse.json(
        { error: "Missing htmlContent or chatPrompt" },
        { status: 400 }
      );
    }

    // Generate divId from user message
    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      system: `
          Determine which section of the HTML the user is referring to.  

          - If the user message refers to a specific section (like "update my skills section" or "change the font in the experience section"), return that section’s divId.  
          - If the user message is about general changes that affect the whole page (like "change the background color of the page" or "update the font for the entire resume"), return divId "page".  
      `,
      schema: outputSchema,
      prompt: `User message: ${chatPrompt}`,
    });

    const divId = result.object.divId;

    if (divId === "not-found") {
      return NextResponse.json({
        finalHtml: htmlContent,
        divId,
        reply: result.object.normalReply,
      });
    }

    const $ = cheerio.load(htmlContent);

    if (divId === "page") {
      const mainDiv = $("#page");

      const innerHTML = mainDiv.html() || "";

      const outerShell = `<div id="page" style="${mainDiv.attr(
        "style"
      )}"></div>`;

      console.log("Outer shell:", outerShell);

      const Stream = await generateObject({
        model: groq("openai/gpt-oss-120b"),
        schema: updateSchema,
        prompt: `
      Here is the outer shell of the main div:
      ${outerShell}

      User request: ${chatPrompt}

      - Only update the outer div (styles, attributes).
      - Do NOT touch inner HTML. Return the updated outer div only.
    `,
      });

      const updatedHtml = Stream?.object?.updatedHtml || "";
      const reply = Stream?.object?.reply || "";
      const suggestions = Stream?.object?.suggestions || [];

      const $updatedShell = cheerio.load(updatedHtml);
      $updatedShell("#page").html(innerHTML);

      $("#page").replaceWith($updatedShell.html());

      const finalHtml = $.html();

      return NextResponse.json({ finalHtml, divId, reply, suggestions });
    }

    const sectionHtml = $(`div#${divId}`);

    // Stream text with tool
    const Stream = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: updateSchema,
      prompt: `
      User wants to update HTML: ${sectionHtml}.
      Please provide updated HTML according to the user request: ${chatPrompt}.
      Make sure to keep the same div id, class names, inline styles, and formatting as the original HTML.
      Only provide the updated HTML without any additional text, explanations, or alterations unrelated to the request.
      If the user request is not relevant to this section, respond with the original HTML exactly as it is.`,
    });

    const updatedHtml = Stream?.object?.updatedHtml || "";
    const reply = Stream?.object?.reply || "";
    const suggestions = Stream?.object?.suggestions || [];

    $(`div#${divId}`).replaceWith(updatedHtml);

    const finalHtml = $.html();

    return NextResponse.json({ finalHtml, divId, reply, suggestions }); // Return the updated HTML and divId
  } catch (error: any) {
    console.error("Error occurred while processing request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
