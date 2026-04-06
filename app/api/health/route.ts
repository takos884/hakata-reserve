import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.course.count();
    return NextResponse.json({ status: "ok", courses: count, db: "connected" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ status: "error", db: "failed", error: message }, { status: 500 });
  }
}
