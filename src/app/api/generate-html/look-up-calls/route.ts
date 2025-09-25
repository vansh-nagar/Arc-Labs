import { groq } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  generateObject,
  generateText,
  streamObject,
  streamText,
  UIMessage,
} from "ai";
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
});

export async function POST(req: NextRequest) {
  const { htmlContent, chatPrompt } = await req.json();

  // Generate divId from user message
  const result = await generateObject({
    model: groq("openai/gpt-oss-120b"),
    system:
      "Determine which section id the user is talking about from the following divs.",
    schema: outputSchema,
    prompt: `User message: ${chatPrompt}`,
  });

  const divId = result.object.divId;

  const $ = cheerio.load(htmlContent);
  const sectionHtml = $(`div#${divId}`);

  // Stream text with tool
  const Stream = await generateObject({
    model: groq("openai/gpt-oss-120b"),
    schema: updateSchema,

    prompt: `User wants to update  HTML: ${sectionHtml}.
Please provide updated HTML. according to user request: ${chatPrompt}.
Make sure to keep the same div id and class names as the original HTML. Only provide the updated HTML without any additional text or explanations. If the user request is not relevant to this section, respond with the original HTML without any changes.`,
  });

  const updatedHtml = Stream?.object?.updatedHtml || "";

  $(`div#${divId}`).replaceWith(updatedHtml);

  const finalHtml = $.html();

  return NextResponse.json({ finalHtml, divId }); // Return the updated HTML and divId
}
