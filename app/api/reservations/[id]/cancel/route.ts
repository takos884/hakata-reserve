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
    const lang = reservation.lang || "en";
    const ct: Record<string, { subject: string; title: string; greeting: string; body: string; date: string; time: string; partySize: string; fee: string; refund: string; refundNote: string; persons: string }> = {
      ja: { subject: "ご予約キャンセル完了 - 博多一瑞亭", title: "ご予約キャンセル完了", greeting: `${reservation.name} 様`, body: "以下のご予約がキャンセルされました。", date: "日付", time: "時間", partySize: "人数", fee: "キャンセル料", refund: "返金額", refundNote: "返金はStripeを通じて処理されます。反映まで5〜10営業日かかる場合があります。", persons: "名" },
      en: { subject: "Reservation Cancelled - Hakata Issuitei", title: "Reservation Cancelled", greeting: `Dear ${reservation.name},`, body: "Your reservation has been cancelled.", date: "Date", time: "Time", partySize: "Party Size", fee: "Cancellation Fee", refund: "Refund Amount", refundNote: "Refunds are processed through Stripe. It may take 5-10 business days to reflect.", persons: " guests" },
      "zh-CN": { subject: "预约已取消 - 博多一瑞亭", title: "预约已取消", greeting: `${reservation.name} 您好，`, body: "以下预约已被取消。", date: "日期", time: "时间", partySize: "人数", fee: "取消费用", refund: "退款金额", refundNote: "退款通过Stripe处理，可能需要5-10个工作日到账。", persons: "人" },
      "zh-TW": { subject: "預約已取消 - 博多一瑞亭", title: "預約已取消", greeting: `${reservation.name} 您好，`, body: "以下預約已被取消。", date: "日期", time: "時間", partySize: "人數", fee: "取消費用", refund: "退款金額", refundNote: "退款透過Stripe處理，可能需要5-10個工作日到帳。", persons: "人" },
      ko: { subject: "예약 취소 - 하카타 잇스이테이", title: "예약 취소 완료", greeting: `${reservation.name}님,`, body: "다음 예약이 취소되었습니다.", date: "날짜", time: "시간", partySize: "인원", fee: "취소 수수료", refund: "환불 금액", refundNote: "환불은 Stripe를 통해 처리됩니다. 반영까지 5-10영업일 소요될 수 있습니다.", persons: "명" },
      th: { subject: "ยกเลิกการจอง - ฮากาตะ อิสซุยเต", title: "ยกเลิกการจองเรียบร้อย", greeting: `เรียน ${reservation.name},`, body: "การจองต่อไปนี้ถูกยกเลิกแล้ว", date: "วันที่", time: "เวลา", partySize: "จำนวนคน", fee: "ค่าธรรมเนียมยกเลิก", refund: "ยอดคืนเงิน", refundNote: "การคืนเงินดำเนินการผ่าน Stripe อาจใช้เวลา 5-10 วันทำการ", persons: " คน" },
    };
    const t = ct[lang] || ct.en;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: reservation.email,
        subject: t.subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #333; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">${t.title}</h1>
            </div>
            <div style="background: white; border: 1px solid #e5e7eb; padding: 24px;">
              <p>${t.greeting}</p>
              <p>${t.body}</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.date}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${visitDate.toLocaleDateString(lang === "ja" ? "ja-JP" : lang === "ko" ? "ko-KR" : lang === "th" ? "th-TH" : lang.startsWith("zh") ? "zh-CN" : "en-US")}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.time}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.visitTime}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.partySize}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.partySize}${t.persons}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.fee}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${feePercent}%</td></tr>
                <tr><td style="padding: 8px; color: #666;">${t.refund}</td><td style="padding: 8px; font-weight: bold;">¥${refundAmount.toLocaleString()}</td></tr>
              </table>
              <p style="color: #666; font-size: 14px;">${t.refundNote}</p>
              <p>博多一瑞亭 / Hakata Issuitei<br/>東京都港区芝5丁目14-1</p>
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
