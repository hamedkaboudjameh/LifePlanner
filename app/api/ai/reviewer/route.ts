import { NextRequest, NextResponse } from "next/server";
import { generateNightlyReview } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gratitude, highlights, dailyMemory, selfImprovementNotes, intentionTomorrow, moodScale } = body;

    const reviewText = await generateNightlyReview({
      gratitude: gratitude || "Grateful for today's learnings.",
      highlights,
      dailyMemory,
      selfImprovementNotes,
      intentionTomorrow,
      moodScale,
    });

    const reviewRecord = await prisma.aICoachAdvice.create({
      data: {
        type: "NIGHTLY_REVIEWER",
        promptInput: JSON.stringify({ gratitude, highlights, moodScale }),
        response: reviewText,
      },
    });

    return NextResponse.json({ success: true, advice: reviewRecord });
  } catch (error) {
    console.error("AI Reviewer route error:", error);
    return NextResponse.json({ error: "Failed to generate nightly review" }, { status: 500 });
  }
}
