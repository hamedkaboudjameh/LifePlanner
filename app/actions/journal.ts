"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface MorningJournalInput {
  gratitude: string;
  dailyAccomplishments?: string;
  excitementPoints?: string;
  emotionalTarget?: string;
}

/**
 * Server Action to save or update today's Morning Journal entry in local SQLite database.
 */
export async function saveMorningJournalAction(input: MorningJournalInput) {
  try {
    if (!input.gratitude || input.gratitude.trim() === "") {
      return { success: false, error: "لطفاً موارد شکرگزاری امروز را وارد کنید." };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if a morning journal entry already exists for today
    const existingEntry = await prisma.morningJournal.findFirst({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    let journal;

    if (existingEntry) {
      // Update today's existing journal entry
      journal = await prisma.morningJournal.update({
        where: { id: existingEntry.id },
        data: {
          gratitude: input.gratitude,
          dailyAccomplishments: input.dailyAccomplishments || null,
          excitementPoints: input.excitementPoints || null,
          emotionalTarget: input.emotionalTarget || null,
        },
      });
    } else {
      // Create new journal entry for today
      journal = await prisma.morningJournal.create({
        data: {
          gratitude: input.gratitude,
          dailyAccomplishments: input.dailyAccomplishments || null,
          excitementPoints: input.excitementPoints || null,
          emotionalTarget: input.emotionalTarget || null,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/journal");

    return { success: true, journal };
  } catch (error) {
    console.error("Server Action error - saveMorningJournal:", error);
    return { success: false, error: "خطا در ذخیره یادداشت صبحگاهی در دیتابیس." };
  }
}

/**
 * Server Action to fetch today's Morning Journal entry from local SQLite database.
 */
export async function getTodayMorningJournalAction() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const journal = await prisma.morningJournal.findFirst({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, journal };
  } catch (error) {
    console.error("Server Action error - getTodayMorningJournal:", error);
    return { success: false, error: "خطا در دریافت یادداشت صبحگاهی." };
  }
}
