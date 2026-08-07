import { NextRequest, NextResponse } from "next/server";
import { generateMorningAdvice } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gratitude, dailyAccomplishments, excitementPoints, emotionalTarget, topTasks } = body;

    const adviceText = await generateMorningAdvice({
      gratitude: gratitude || "Starting today with focus and intentionality.",
      dailyAccomplishments,
      excitementPoints,
      emotionalTarget,
      topTasks: topTasks || [],
    });

    // Save to AICoachAdvice table
    const adviceRecord = await prisma.aICoachAdvice.create({
      data: {
        type: "MORNING_ADVISOR",
        promptInput: JSON.stringify({ gratitude, dailyAccomplishments, topTasks }),
        response: adviceText,
      },
    });

    return NextResponse.json({ success: true, advice: adviceRecord });
  } catch (error) {
    console.error("AI Advisor route error:", error);
    return NextResponse.json({ error: "Failed to generate morning advice" }, { status: 500 });
  }
}
