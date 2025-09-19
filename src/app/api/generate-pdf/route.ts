// app/api/generate-pdf/route.ts
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { html } = await req.json(); // receive HTML from client

    // Launch headless Chrome
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set the content of the page to the resume HTML
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
    });

    await browser.close();

    return new Response(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error generating PDF", { status: 500 });
  }
}
