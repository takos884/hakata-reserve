import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const policies = await prisma.cancellationPolicy.findMany({
    orderBy: { daysBeforeMin: "desc" },
  });
  return NextResponse.json(policies);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const policy = await prisma.cancellationPolicy.create({ data: body });
  return NextResponse.json(policy, { status: 201 });
}
