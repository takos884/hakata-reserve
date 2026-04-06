import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({ where: { id } });

  if (!reservation?.stripePaymentIntentId) {
    return NextResponse.json(
      { error: "No payment found" },
      { status: 400 }
    );
  }

  // Calculate refund amount based on cancellation policy
  const now = new Date();
  const visitDate = new Date(reservation.visitDate);
  const daysUntilVisit = Math.ceil(
    (visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const policies = await prisma.cancellationPolicy.findMany({
    orderBy: { daysBeforeMin: "desc" },
  });

  let feePercent = 100; // default: full charge
  for (const policy of policies) {
    if (
      daysUntilVisit >= policy.daysBeforeMin &&
      (policy.daysBeforeMax === null || daysUntilVisit <= policy.daysBeforeMax)
    ) {
      feePercent = policy.feePercent;
      break;
    }
  }

  const refundPercent = 100 - feePercent;
  const refundAmount = Math.floor(
    ((reservation.amountPaid || 0) * refundPercent) / 100
  );

  if (refundAmount > 0) {
    await stripe.refunds.create({
      payment_intent: reservation.stripePaymentIntentId,
      amount: refundAmount,
    });
  }

  await prisma.reservation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ refundAmount, feePercent });
}
