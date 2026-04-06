import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resend, FROM_EMAIL } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import {
  confirmationEmail,
  reminderEmail,
  cancellationEmail,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, reservationId } = await request.json();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { course: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  const data = {
    name: reservation.name,
    visitDate: reservation.visitDate.toLocaleDateString("en-US"),
    visitTime: reservation.visitTime,
    partySize: reservation.partySize,
    courseName: reservation.course?.nameEn || "-",
    amountPaid: reservation.amountPaid || 0,
    reservationId: reservation.id,
  };

  let email: { subject: string; html: string };

  switch (type) {
    case "confirmation":
      email = confirmationEmail(reservation.lang, data);
      break;
    case "reminder":
      email = reminderEmail(reservation.lang, data);
      break;
    case "cancellation":
      email = cancellationEmail(reservation.lang, data);
      break;
    default:
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: reservation.email,
    subject: email.subject,
    html: email.html,
  });

  return NextResponse.json({ sent: true });
}
