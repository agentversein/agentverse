import { tavily } from "@tavily/core";
import { runAI } from "@/lib/ai";
import connectDB from "@/lib/mongodb";
import Memory from "@/models/Memory";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});
const systemPrompts = {
 "chat-agent": `
You are AgentVerse AI, an advanced AI assistant.

Rules:

- Answer every question directly.
- Be intelligent, helpful and natural.
- Answer questions about coding, business, science, history, sports, jobs, interview, maths, writing and general knowledge.
- If the user asks about themselves, use the provided memory.
- Never mention stored memory unless it is relevant.
- If information requires live internet data, clearly say that a web search is required.
- Never ignore the user's question.
- Give complete answers with examples when useful.
`,

  "coding-agent":
    "You are an expert software engineer. Write clean, correct, and well-explained code.",

  "seo-agent":
    "You are an SEO expert. Write SEO-friendly blogs, titles, meta descriptions, keywords, and content.",
  "resume-agent": `
You are a world-class ATS Resume Builder.

Return ONLY valid JSON.

Do not return markdown.
Do not return explanations.
Do not wrap in \\\`.
Never leave fields empty.

If the user does not provide information, intelligently generate realistic ATS-quality details.

Always fill:
- Professional Summary
- At least 10 Skills
- At least 2 Experience entries
- At least 2 Projects
- Education
- Certifications
- Languages
- Achievements
If the user provides personal details, create a complete ATS resume using ONLY those details.

Never invent companies, colleges, projects, certifications or skills.

If any field is missing, keep it empty instead of generating fake information.

Return only valid JSON.
Generate realistic experience and projects if none are provided.
{
  "name":"",
  "title":"",
  "email":"",
  "phone":"",
  "location":"",
  "linkedin":"",
  "github":"",
  "website":"",
  "summary":"",
  "skills":[],
  "experience":[
    {
      "company":"",
      "role":"",
      "duration":"",
      "description":""
    }
  ],
  "projects":[
    {
      "name":"",
      "description":"",
      "technologies":[]
    }
  ],
  "education":[
    {
      "college":"",
      "degree":"",
      "year":""
    }
  ],
  "certifications":[],
  "languages":[],
  "achievements":[]
}
`,

  "email-agent":
    "You are a professional email writer. Write clear, polite, and effective emails.",

 "research-agent": `
You are AgentVerse Research AI.

Generate a professional research report.

Use the following structure.

# Executive Summary

(2-4 paragraphs)

---

# Key Findings

* Finding 1
* Finding 2
* Finding 3
* Finding 4
* Finding 5

---

# Detailed Analysis

Explain everything in detail with headings.

---

# Market Analysis

Current market
Growth
Challenges
Future

---

# Competitor Comparison

Create a markdown table.

| Company | Strength | Weakness | Pricing |

---

# SWOT Analysis

## Strengths

## Weaknesses

## Opportunities

## Threats

---

# Risks

Mention possible risks.

---

# Recommendations

Give actionable recommendations.

---

# Sources

Mention reliable public sources if available.

---

# Confidence Score

Give confidence percentage.

Always use proper Markdown headings, bullet points and tables.
Never return plain text.
`,

  "data-agent":
`You are a senior data analyst.

Analyze datasets professionally.

Always provide:

1. Dataset overview
2. Key trends
3. Interesting insights
4. Potential issues
5. Business recommendations

Keep the answer short and easy to understand.`,
};

export async function POST(req) {
  try {
    const { agentId, prompt, history =[], chatId, documentText,documentname, } = await req.json();
await connectDB();

const session = await getServerSession(authOptions);
const user = session?.user?.email
  ? await User.findOne({ email: session.user.email })
  : null;

if (user && !user.isPro) {

  const limits = {
    "chat-agent": ["chatCount", 15],
    "image-agent": ["imageCount", 1],
    "coding-agent": ["codeCount", 1],
    "seo-agent": ["seoCount", 1],
    "resume-agent": ["resumeCount", 1],
    "email-agent": ["emailCount", 1],
    "research-agent": ["researchCount", 1],
    "data-agent": ["dataCount", 1],
  };

  if (limits[agentId]) {

    const [field, limit] = limits[agentId];

    if ((user[field] || 0) >= limit) {

      return Response.json({
        success: false,
        code: "LIMIT_REACHED",
        message:
          "Your free limit is over. Please upgrade to AgentVerse Pro.",
      });

    }

    user[field]++;

    await user.save();

  }

}
let memoryContext = "";

if (session?.user?.email) {
 const memories = await Memory.find({
  userEmail: session.user.email,
})
  .sort({ createdAt: -1 })
  .limit(20);

  if (memories.length > 0) {
  memoryContext = `
User Memory:

${memories
  .map((m) => {
    if (m.key && m.value) return `${m.key}: ${m.value}`;
    if (m.role && m.content) return `${m.role}: ${m.content}`;
    return "";
  })
  .join("\n")}

Important:
Use this memory ONLY when the user asks about themselves.
Do NOT mention the user's memory while answering general questions.
`;
}
}
    if (!agentId || !prompt) {
      return Response.json(
        { error: "agentId and prompt are required" },
        { status: 400 }
      );
    }
const needsWeb =
  /\b(today|latest|current|news|price|stock|weather|score|live|yesterday|this week|2026|2025)\b/i.test(
    prompt
  );

let webContext = "";

if (needsWeb) {
  try {
    const result = await tvly.search(prompt, {
      topic: "general",
      searchDepth: "basic",
      maxResults: 3,
    });

    webContext = `
Latest Web Information:

${result.results
  .map(
    (r) => `
Title: ${r.title}

${r.content}
`
  )
  .join("\n")}
`;
  } catch (e) {
    console.log("Web search failed:", e);
  }
}
    if (agentId === "image-agent") {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      return Response.json({
        type: "image",
        output: imageUrl,
      });
    }

    const systemPrompt =
      (systemPrompts[agentId] || systemPrompts["chat-agent"]) +
      memoryContext;
      
 const result = await runAI([
  {
    role: "system",
    content: `
${systemPrompt}

${webContext}

${
documentText
? `Document:

${documentText}`
: ""
}
`,
  },
  ...history,
  {
    role: "user",
    content: prompt,
  },
]);

const aiReply = result.output;
if (chatId) {
  await Chat.findByIdAndUpdate(chatId, {
    $push: {
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: aiReply,
        },
      ],
    },
  });
}
// Save full conversation
if (session?.user?.email) {
  await Memory.create({
    userEmail: session.user.email,
    role: "user",
    content: prompt,
  });

  await Memory.create({
    userEmail: session.user.email,
    role: "assistant",
    content: aiReply,
  });
}
// Save simple memories
if (session?.user?.email) {
  const patterns = [
   {
  key: "name",
  regex: /(my name is|i am|i'm|my name's)\s+(.+)/i,
},
    {
      key: "location",
      regex: /i live in (.+)/i,
    },
    {
      key: "company",
      regex: /i work at (.+)/i,
    },
    {
      key: "goal",
      regex: /my goal is (.+)/i,
    },
    {
      key: "favorite",
      regex: /i like (.+)/i,
    },
  ];

  for (const item of patterns) {
    const match = prompt.match(item.regex);

    if (match) {
      await Memory.findOneAndUpdate(
        {
          userEmail: session.user.email,
          key: item.key,
        },
        {
          value: match[2],
        },
        {
          upsert: true,
        }
      );
    }
  }
}

    return Response.json({
  type: "text",
  output: aiReply,
});
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}