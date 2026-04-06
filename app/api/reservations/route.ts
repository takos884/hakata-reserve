import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { reservationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check if date is blocked
  const visitDate = new Date(data.visitDate);
  const blocked = await prisma.blockedDate.findFirst({
    where: {
      date: {
        gte: new Date(visitDate.setHours(0, 0, 0, 0)),
        lt: new Date(visitDate.setHours(23, 59, 59, 999)),
      },
    },
  });

  if (blocked) {
    return NextResponse.json(
      { error: "Selected date is not available" },
      { status: 400 }
    );
  }

  // Get course price
  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 400 });
  }

  const totalAmount = course.price * data.partySize;

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: "jpy",
    metadata: {
      customerName: data.name,
      customerEmail: data.email,
      visitDate: data.visitDate,
      partySize: String(data.partySize),
      courseId: data.courseId,
    },
  });

  // Create reservation record
  const reservation = await prisma.reservation.create({
    data: {
      type: "INDIVIDUAL",
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      nationality: data.nationality || null,
      visitDate: new Date(data.visitDate),
      visitTime: data.visitTime,
      partySize: data.partySize,
      courseId: data.courseId,
      notes: data.notes || null,
      lang: data.lang,
      stripePaymentIntentId: paymentIntent.id,
      amountPaid: totalAmount,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    reservationId: reservation.id,
    clientSecret: paymentIntent.client_secret,
    amount: totalAmount,
  });
}
