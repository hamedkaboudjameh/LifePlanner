import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const journal = await prisma.morningJournal.findFirst({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: { createdAt: "desc" },
      include: { photos: true },
    });

    return NextResponse.json({ journal });
  } catch (error) {
    console.error("GET morning journal error:", error);
    return NextResponse.json({ error: "Failed to fetch morning journal" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gratitude, dailyAccomplishments, excitementPoints, emotionalTarget } = body;

    const journal = await prisma.morningJournal.create({
      data: {
        gratitude: typeof gratitude === "string" ? gratitude : JSON.stringify(gratitude),
        dailyAccomplishments,
        excitementPoints,
        emotionalTarget,
      },
    });

    return NextResponse.json({ success: true, journal });
  } catch (error) {
    console.error("POST morning journal error:", error);
    return NextResponse.json({ error: "Failed to save morning journal" }, { status: 500 });
  }
}
