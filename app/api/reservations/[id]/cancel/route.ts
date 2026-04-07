import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { resend, FROM_EMAIL } from "@/lib/mail";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email } = await request.json();

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Verify email matches
    if (reservation.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Email does not match" }, { status: 403 });
    }

    if (reservation.status === "CANCELLED") {
      return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
    }

    // Calculate refund based on cancellation policy
    const now = new Date();
    const visitDate = new Date(reservation.visitDate);
    const daysUntilVisit = Math.ceil(
      (visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const policies = await prisma.cancellationPolicy.findMany({
      orderBy: { daysBeforeMin: "desc" },
    });

    let feePercent = 100;
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

    // Process Stripe refund
    if (refundAmount > 0 && reservation.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: reservation.stripePaymentIntentId,
        amount: refundAmount,
      });
    }

    // Update status
    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Send cancellation email to customer
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: reservation.email,
        subject: "ご予約キャンセル完了 - 博多一瑞亭",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #333; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">ご予約キャンセル完了</h1>
            </div>
            <div style="background: white; border: 1px solid #e5e7eb; padding: 24px;">
              <p>${reservation.name} 様</p>
              <p>以下のご予約がキャンセルされました。</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">日付</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${visitDate.toLocaleDateString("ja-JP")}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">時間</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.visitTime}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">人数</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.partySize}名</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">キャンセル料</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${feePercent}%</td></tr>
                <tr><td style="padding: 8px; color: #666;">返金額</td><td style="padding: 8px; font-weight: bold;">¥${refundAmount.toLocaleString()}</td></tr>
              </table>
              <p style="color: #666; font-size: 14px;">返金はStripeを通じて処理されます。反映まで5〜10営業日かかる場合があります。</p>
              <p>博多一瑞亭<br/>東京都港区芝5丁目14-1</p>
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }

    // Notify admin
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: process.env.ADMIN_EMAIL!,
        subject: `予約キャンセル: ${reservation.name} (${visitDate.toLocaleDateString("ja-JP")})`,
        html: `
          <h2>予約がキャンセルされました</h2>
          <ul>
            <li>氏名: ${reservation.name}</li>
            <li>来店日: ${visitDate.toLocaleDateString("ja-JP")}</li>
            <li>人数: ${reservation.partySize}名</li>
            <li>キャンセル料: ${feePercent}%</li>
            <li>返金額: ¥${refundAmount.toLocaleString()}</li>
          </ul>
        `,
      });
    } catch (e) {
      console.error("Failed to send admin cancel notification:", e);
    }

    return NextResponse.json({ refundAmount, feePercent, refundPercent });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
