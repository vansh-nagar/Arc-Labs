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
    "not-found",
  ]),
});

const updateSchema = z.object({
  updatedHtml: z
    .string()
    .describe("The updated HTML content for the specified div."),

  reply: z.string().describe("reply for the changes you made."),
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
      system:
        "Determine which section id the user is talking about from the following divs.",
      schema: outputSchema,
      prompt: `User message: ${chatPrompt}`,
    });

    const divId = result.object.divId;

    if (divId === "not-found") {
      return NextResponse.json({
        finalHtml: htmlContent,
        divId,
        reply: "Could not determine the section to update. No changes made.",
      });
    }

    const $ = cheerio.load(htmlContent);
    const sectionHtml = $(`div#${divId}`);

    // Stream text with tool
    const Stream = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: updateSchema,
      prompt: `User wants to update HTML: ${sectionHtml}.
      Please provide updated HTML according to the user request: ${chatPrompt}.
      Make sure to keep the same div id, class names, inline styles, and formatting as the original HTML.
      Only provide the updated HTML without any additional text, explanations, or alterations unrelated to the request.
      If the user request is not relevant to this section, respond with the original HTML exactly as it is.`,
    });

    const updatedHtml = Stream?.object?.updatedHtml || "";
    const reply = Stream?.object?.reply || "";

    $(`div#${divId}`).replaceWith(updatedHtml);

    const finalHtml = $.html();

    return NextResponse.json({ finalHtml, divId, reply }); // Return the updated HTML and divId
  } catch (error: any) {
    console.error("Error occurred while processing request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
