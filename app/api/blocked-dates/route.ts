import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const dates = await prisma.blockedDate.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(dates);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const blockedDate = await prisma.blockedDate.create({
    data: {
      date: new Date(body.date),
      note: body.note || null,
    },
  });
  return NextResponse.json(blockedDate, { status: 201 });
}
