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

      // Check if this is an agency deposit payment
      if (paymentIntent.metadata?.type === "agency_deposit") {
        const agencyInquiry = await prisma.agencyInquiry.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (agencyInquiry) {
          await prisma.agencyInquiry.update({
            where: { id: agencyInquiry.id },
            data: { depositPaid: true },
          });

          // Send deposit confirmation to agency
          await resend.emails.send({
            from: FROM_EMAIL,
            to: agencyInquiry.email,
            subject: "Deposit Received - Hakata Issuitei / 預り金受領 - 博多一瑞亭",
            html: `
              <h2>預り金のお支払いを確認しました</h2>
              <p>${agencyInquiry.contactName} 様（${agencyInquiry.agencyName}）</p>
              <ul>
                <li>来店希望日: ${agencyInquiry.visitDate.toLocaleDateString("ja-JP")}</li>
                <li>人数: ${agencyInquiry.partySize}名</li>
                <li>預り金: ¥${(agencyInquiry.depositAmount || 20000).toLocaleString()}</li>
              </ul>
              <p>内容を確認の上、担当者よりご連絡いたします。</p>
              <p>博多一瑞亭<br/>東京都港区芝5丁目14-1</p>
            `,
          });

          // Notify store
          await resend.emails.send({
            from: FROM_EMAIL,
            to: process.env.ADMIN_EMAIL!,
            subject: `代理店預り金入金: ${agencyInquiry.agencyName} (¥${(agencyInquiry.depositAmount || 20000).toLocaleString()})`,
            html: `
              <h2>代理店預り金が入金されました</h2>
              <ul>
                <li>代理店名: ${agencyInquiry.agencyName}</li>
                <li>担当者: ${agencyInquiry.contactName}</li>
                <li>来店希望日: ${agencyInquiry.visitDate.toLocaleDateString("ja-JP")}</li>
                <li>人数: ${agencyInquiry.partySize}名</li>
                <li>預り金: ¥${(agencyInquiry.depositAmount || 20000).toLocaleString()}</li>
              </ul>
              <p><a href="${process.env.NEXTAUTH_URL}/admin/agencies">管理画面で確認</a></p>
            `,
          });
        }
        break;
      }

      // Individual reservation payment
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
            <p>Hakata Issuitei<br/>5-14-1 Shiba, Minato-ku, Tokyo</p>
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
