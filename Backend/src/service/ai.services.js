const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require('puppeteer');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
  title: z.string(),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You MUST return ONLY valid JSON.

IMPORTANT RULES:
- technicalQuestions must be ARRAY of OBJECTS
- behavioralQuestions must be ARRAY of OBJECTS
- skillGaps must be ARRAY of OBJECTS
- preparationPlan must be ARRAY of OBJECTS

DO NOT return strings inside arrays.

Return EXACT format:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ],
  "title": string
}

Resume: ${resume}
Self: ${selfDescription}
Job: ${jobDescription}
`,
        },
        {
          role: "user",
          content: `
Resume: ${resume}

Self Description: ${selfDescription}

Job Description: ${jobDescription}
          `,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty Groq response");
    }

    const parsed = JSON.parse(content);

    // 🔥 STRICT VALIDATION USING YOUR SCHEMA
    const validated = interviewReportSchema.parse(parsed);

    // console.log(JSON.stringify(validated, null, 2));

    return validated;
  } catch (err) {
    console.error("AI ERROR:", err.message);

    return {
      matchScore: 0,
      technicalQuestions: [],
      behavioralQuestions: [],
      skillGaps: [],
      preparationPlan: [],
      title: "Error generating report",
      error: true,
    };
  }
}
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch() ;
  const page = await browser.newPage() ;
  await page.setContent(htmlContent , {waitUntil: "networkidle0"})
  const pdfBuffer = await page.pdf({format: "A4" ,  margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }})
  await browser.close() ;
  return pdfBuffer
}
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string().describe("HTML content of resume"),
  });

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
  role: "system",
  content: `
You are an expert professional resume writer and HTML developer.

You generate ATS-friendly, human-like resumes in clean HTML format.

STRICT RULES:
- Return ONLY valid JSON
- No markdown, no explanation, no extra text
- JSON must contain ONLY one field: "html"

OUTPUT FORMAT:
{
  "html": "<complete HTML resume>"
}

RESUME REQUIREMENTS:
- Tailor resume specifically for the given job description
- Highlight only relevant skills, experience, and projects
- Must sound like a real human-written resume (not AI-generated)
- Avoid generic phrases like "hardworking" or "motivated"
- Keep content concise and impactful

LENGTH:
- Must fit 1–2 pages when converted to PDF

ATS FRIENDLY RULES:
- Use simple structure with standard headings:
  Summary, Skills, Experience, Projects, Education
- Avoid complex layouts, tables, or heavy styling
- Ensure content is easily parsable by ATS systems

HTML DESIGN RULES:
- Clean, minimal, professional layout
- Use simple fonts (Arial, Helvetica, Inter)
- Use subtle styling only (no flashy design)
- Proper spacing and clear section separation
- Must be PDF-ready for Puppeteer

FINAL RULE:
Return ONLY the JSON object with "html".
`
}
,
        {
          role: "user",
          content: `
Generate a professional resume.

Resume Data:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return only JSON with html field.
          `,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty Groq response");
    }

    const parsed = JSON.parse(content);

    // validate using zod
    const validated = resumePdfSchema.parse(parsed);
  
if (!validated?.html) {

  throw new Error("HTML not generated");

}

    const pdfBuffer = await generatePdfFromHtml(validated.html)
    return pdfBuffer;
  } catch (err) {
    console.error("Resume PDF generation error:", err.message);

    return {
      html: "<h1>Error generating resume</h1>",
      error: true,
    };
  }
}

module.exports = {generateInterviewReport , generateResumePdf};
