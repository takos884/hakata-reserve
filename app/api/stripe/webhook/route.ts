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
        const baseUrl = process.env.NEXTAUTH_URL || "https://hakata-reserve.vercel.app";
        const lang = reservation.lang || "en";
        const cancelUrl = `${baseUrl}/${lang}/reserve/cancel?id=${reservation.id}`;

        await resend.emails.send({
          from: FROM_EMAIL,
          to: reservation.email,
          subject: lang === "ja" ? "ご予約確認 - 博多一瑞亭" : "Reservation Confirmed - Hakata Issuitei",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #d4a853; color: #000; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 20px;">${lang === "ja" ? "ご予約が確定しました" : "Your reservation is confirmed!"}</h1>
              </div>
              <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px;">
                <p>${lang === "ja" ? `${reservation.name} 様` : `Dear ${reservation.name},`}</p>
                <p>${lang === "ja" ? "ご予約の詳細は以下の通りです：" : "Your reservation details:"}</p>
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${lang === "ja" ? "日付" : "Date"}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.visitDate.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US")}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${lang === "ja" ? "時間" : "Time"}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.visitTime}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${lang === "ja" ? "人数" : "Party Size"}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.partySize}${lang === "ja" ? "名" : " guests"}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${lang === "ja" ? "コース" : "Course"}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${lang === "ja" ? (reservation.course?.nameJa || "-") : (reservation.course?.nameEn || "-")}</td></tr>
                  <tr><td style="padding: 8px; color: #666;">${lang === "ja" ? "お支払い金額" : "Amount Paid"}</td><td style="padding: 8px; font-weight: bold;">¥${reservation.amountPaid?.toLocaleString()}</td></tr>
                </table>
                <p>${lang === "ja" ? "ご来店を心よりお待ちしております。" : "We look forward to seeing you!"}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 13px; color: #888;">${lang === "ja" ? "ご予約のキャンセルをご希望の場合は、以下のリンクからお手続きください。" : "If you need to cancel your reservation, please use the link below."}</p>
                <p style="text-align: center; margin: 16px 0;">
                  <a href="${cancelUrl}" style="color: #d4a853; font-size: 13px;">${lang === "ja" ? "予約をキャンセルする" : "Cancel Reservation"}</a>
                </p>
                <p style="font-size: 12px; color: #aaa;">博多一瑞亭 / Hakata Issuitei<br/>東京都港区芝5丁目14-1</p>
              </div>
            </div>
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
