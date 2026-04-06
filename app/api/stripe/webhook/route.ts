import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/mail";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const reservation = await prisma.reservation.findFirst({
        where: { stripePaymentIntentId: paymentIntent.id },
        include: { course: true },
      });

      if (reservation) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: "CONFIRMED" },
        });

        // Send confirmation email to customer
        await resend.emails.send({
          from: FROM_EMAIL,
          to: reservation.email,
          subject: "Reservation Confirmed - Hakata Issuitei",
          html: `
            <h2>Your reservation is confirmed!</h2>
            <p>Dear ${reservation.name},</p>
            <p>Your reservation details:</p>
            <ul>
              <li>Date: ${reservation.visitDate.toLocaleDateString("en-US")}</li>
              <li>Time: ${reservation.visitTime}</li>
              <li>Party size: ${reservation.partySize}</li>
              <li>Course: ${reservation.course?.nameEn || "-"}</li>
              <li>Amount paid: ¥${reservation.amountPaid?.toLocaleString()}</li>
            </ul>
            <p>We look forward to seeing you!</p>
            <p>Hakata Issuitei<br/>Mita, Tokyo</p>
          `,
        });

        // Notify store
        await resend.emails.send({
          from: FROM_EMAIL,
          to: process.env.ADMIN_EMAIL!,
          subject: `新規予約確定: ${reservation.name} (${reservation.visitDate.toLocaleDateString("ja-JP")})`,
          html: `
            <h2>新規予約が確定しました</h2>
            <ul>
              <li>氏名: ${reservation.name}</li>
              <li>来店日: ${reservation.visitDate.toLocaleDateString("ja-JP")}</li>
              <li>時間: ${reservation.visitTime}</li>
              <li>人数: ${reservation.partySize}名</li>
              <li>コース: ${reservation.course?.nameJa || "-"}</li>
              <li>決済額: ¥${reservation.amountPaid?.toLocaleString()}</li>
            </ul>
            <p><a href="${process.env.NEXTAUTH_URL}/admin/reservations/${reservation.id}">管理画面で確認</a></p>
          `,
        });
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await prisma.reservation.updateMany({
          where: { stripePaymentIntentId: charge.payment_intent as string },
          data: { status: "CANCELLED" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
