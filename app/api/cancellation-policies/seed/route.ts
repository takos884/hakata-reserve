import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Default cancellation policies from SPEC
  const defaults = [
    { daysBeforeMin: 8, daysBeforeMax: null, feePercent: 0 },
    { daysBeforeMin: 3, daysBeforeMax: 7, feePercent: 30 },
    { daysBeforeMin: 1, daysBeforeMax: 2, feePercent: 50 },
    { daysBeforeMin: 0, daysBeforeMax: 0, feePercent: 100 },
  ];

  await prisma.cancellationPolicy.deleteMany();
  const policies = await prisma.cancellationPolicy.createMany({
    data: defaults,
  });

  return NextResponse.json({ count: policies.count });
}
