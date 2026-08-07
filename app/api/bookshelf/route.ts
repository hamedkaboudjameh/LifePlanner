import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { summarizeBook } from "@/lib/ollama";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      include: { review: true },
    });
    return NextResponse.json({ books });
  } catch (error) {
    console.error("GET books error:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, category, rating, status, userNotes } = body;

    if (!title || !author) {
      return NextResponse.json({ error: "Title and Author required" }, { status: 400 });
    }

    // Generate AI Summary using Ollama Gemma if notes provided
    let aiSummary = "";
    if (userNotes) {
      aiSummary = await summarizeBook({ title, author, userNotes });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        category: category || "General",
        rating: rating ? Number(rating) : undefined,
        status: status || "READING",
        review: aiSummary
          ? {
              create: {
                summary: aiSummary,
                personalThoughts: userNotes,
              },
            }
          : undefined,
      },
      include: { review: true },
    });

    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error("POST book error:", error);
    return NextResponse.json({ error: "Failed to create book entry" }, { status: 500 });
  }
}
