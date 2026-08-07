import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reflection = await prisma.nightlyReflection.findFirst({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: { createdAt: "desc" },
      include: { photos: true },
    });

    return NextResponse.json({ reflection });
  } catch (error) {
    console.error("GET nightly reflection error:", error);
    return NextResponse.json({ error: "Failed to fetch nightly reflection" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gratitude, highlights, dailyMemory, selfImprovementNotes, intentionTomorrow } = body;

    const reflection = await prisma.nightlyReflection.create({
      data: {
        gratitude: typeof gratitude === "string" ? gratitude : JSON.stringify(gratitude),
        highlights,
        dailyMemory,
        selfImprovementNotes,
        intentionTomorrow,
      },
    });

    return NextResponse.json({ success: true, reflection });
  } catch (error) {
    console.error("POST nightly reflection error:", error);
    return NextResponse.json({ error: "Failed to save nightly reflection" }, { status: 500 });
  }
}
