export interface OllamaConfig {
  baseUrl?: string;
  model?: string;
}

const DEFAULT_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "gemma";

export async function generateOllamaResponse(
  prompt: string,
  systemPrompt?: string,
  config: OllamaConfig = {}
): Promise<string> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const model = config.model || DEFAULT_MODEL;

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        system: systemPrompt || "You are an insightful, empathetic, and highly practical AI Life Coach. Provide concise, structured, and actionable advice.",
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response?.trim() || "No response generated from AI Coach.";
  } catch (error) {
    console.error("Ollama client error:", error);
    // Fallback message if Ollama is not running locally
    return `[AI Coach Offline / Connection Note]: Could not connect to Ollama at ${baseUrl}. Ensure Ollama is installed and running with '${model}' model ('ollama run ${model}').`;
  }
}

export async function generateMorningAdvice(data: {
  gratitude: string;
  dailyAccomplishments?: string;
  excitementPoints?: string;
  emotionalTarget?: string;
  topTasks?: string[];
}) {
  const prompt = `
Morning Journal Data:
- Gratitude: ${data.gratitude}
- Intended Accomplishments: ${data.dailyAccomplishments || "N/A"}
- Excitement Points: ${data.excitementPoints || "N/A"}
- Emotional Target: ${data.emotionalTarget || "N/A"}
- Top Scheduled Tasks: ${data.topTasks?.join(", ") || "None listed"}

Based on these morning reflections and top priorities, act as an AI Life Coach and provide:
1. 💡 **Mindset Focus**: A short 2-sentence empowering theme for today.
2. 🎯 **Priority Guidance**: Recommended sequence to tackle today's tasks smoothly.
3. ⚡ **Energy Boost**: 1 practical micro-habit to sustain high energy today.
`;

  return generateOllamaResponse(prompt, "You are the Morning Advisor for Life OS.");
}

export async function generateNightlyReview(data: {
  gratitude: string;
  highlights?: string;
  dailyMemory?: string;
  selfImprovementNotes?: string;
  intentionTomorrow?: string;
  moodScale?: number;
}) {
  const prompt = `
Nightly Reflection Data:
- Gratitude: ${data.gratitude}
- Highlights: ${data.highlights || "N/A"}
- Standout Memory: ${data.dailyMemory || "N/A"}
- Growth/Improvement Notes: ${data.selfImprovementNotes || "N/A"}
- Intention for Tomorrow: ${data.intentionTomorrow || "N/A"}
- Mood (1-10): ${data.moodScale !== undefined ? `${data.moodScale}/10` : "N/A"}

Act as an AI Life Coach evaluating tonight's reflection:
1. 🌟 **Daily Celebration**: Recognize today's wins and positive moments.
2. 🌱 **Growth Insight**: Constructive takeaway from the self-improvement note.
3. 🌙 **Wind-down Intent**: Final reassuring advice before sleep to prepare for tomorrow.
`;

  return generateOllamaResponse(prompt, "You are the Nightly Reviewer for Life OS.");
}

export async function summarizeBook(data: {
  title: string;
  author: string;
  userNotes?: string;
}) {
  const prompt = `
Book: "${data.title}" by ${data.author}
User's Personal Notes: ${data.userNotes || "None provided"}

Generate a structured summary for this book:
1. 📌 **Core Thesis**: The 2-sentence main takeaway.
2. 🔑 **3 Key Actionable Insights**: Bullet points of practical lessons.
3. 💬 **Memorable Quote Suggestion**: A renowned or representative quote from the book.
`;

  return generateOllamaResponse(prompt, "You are an expert Executive Book Summarizer.");
}
