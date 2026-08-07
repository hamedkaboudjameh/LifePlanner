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
        system: systemPrompt || "شما یک مربی هوشمند زندگی (AI Life Coach) دلسوز، الهام‌بخش و با برنامه‌ریزی دقیق هستید. پاسخ‌های خود را کاملاً به زبان فارسی، ساختاریافته و کاربردی ارائه دهید.",
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`خطای API اولاما: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response?.trim() || "پاسخی از مربی هوشمند دریافت نشد.";
  } catch (error) {
    console.error("خطای ارتباط با Ollama:", error);
    return `[ارتباط با مربی هوشمند برقرار نشد]: لطفا اطمینان حاصل کنید که سرور Ollama با مدل '${model}' در حال اجرا است ('ollama run ${model}').`;
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
اطلاعات یادداشت صبحگاهی:
- شکرگزاری: ${data.gratitude}
- دستاوردهای هدف امروز: ${data.dailyAccomplishments || "ثبت نشده"}
- نقاط هیجان‌انگیز امروز: ${data.excitementPoints || "ثبت نشده"}
- هدف احساسی امروز: ${data.emotionalTarget || "ثبت نشده"}
- اولویت‌های اصلی کاری: ${data.topTasks?.join("، ") || "بدون اولویت ثبت شده"}

به عنوان مربی هوشمند زندگی، توصیه‌های صبحگاهی زیر را به زبان فارسی ارائه دهید:
۱. 💡 **تمرکز ذهن**: یک جمله انگیزشی برای شروع پرقدرت امروز.
۲. 🎯 **راهنمای اولویت‌ها**: ترتیب پیشنهادی برای انجام کارهای امروز.
۳. ⚡ **افزایش انرژی**: یک راهکار کوچک و عمل‌گرایانه برای حفظ انرژی در طول روز.
`;

  return generateOllamaResponse(prompt, "شما مشاور و مربی صبحگاهی سیستم مدیریت زندگی (Life OS) هستید.");
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
اطلاعات بازخورد شبانه:
- ۳ شکرگزاری: ${data.gratitude}
- لحظات لبخند و نقاط برجسته: ${data.highlights || "ثبت نشده"}
- خاطره ماندگار امروز: ${data.dailyMemory || "ثبت نشده"}
- نکات رشد و بهبود فردی: ${data.selfImprovementNotes || "ثبت نشده"}
- قصد و هدف فردا: ${data.intentionTomorrow || "ثبت نشده"}
- میزان خلق‌وخو (۱ تا ۱۰): ${data.moodScale !== undefined ? `${data.moodScale} از ۱۰` : "ثبت نشده"}

به عنوان مربی هوشمند شبانه، ارزیابی زیر را به زبان فارسی ارائه دهید:
۱. 🌟 **تقدیر از موفقیت‌های امروز**: تحسین دستاوردها و احساسات مثبت امروز.
۲. 🌱 **تحلیل مسیر رشد**: نکته سازنده از یادداشت بهبود فردی.
۳. 🌙 **آمادگی برای آرامش شبانه**: توصیه آرامش‌بخش نهایی قبل از خواب برای شروعی پرانرژی در فردا.
`;

  return generateOllamaResponse(prompt, "شما ارزیاب و مربی شبانه سیستم مدیریت زندگی (Life OS) هستید.");
}

export async function summarizeBook(data: {
  title: string;
  author: string;
  userNotes?: string;
}) {
  const prompt = `
کتاب: "${data.title}" اثر ${data.author}
یادداشت‌های کاربر: ${data.userNotes || "ثبت نشده"}

یک خلاصه ساختاریافته به زبان فارسی تولید کنید:
۱. 📌 **پیام اصلی کتاب**: خلاصه در ۲ جمله کاربردی.
۲. 🔑 **۳ کلیدواژه و آموزه کاربردی**: به صورت بالت‌پوینت.
۳. 💬 **جمله برجسته و ارزشمند**: یک نقل‌قول الهام‌بخش یا کلیدی.
`;

  return generateOllamaResponse(prompt, "شما خلاصه کننده‌ حرفه‌ای کتاب‌ها هستید.");
}
