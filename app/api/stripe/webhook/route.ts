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

        const emailT: Record<string, { subject: string; title: string; greeting: string; body: string; date: string; time: string; partySize: string; course: string; amount: string; closing: string; cancelNote: string; cancelLink: string; persons: string }> = {
          ja: { subject: "ご予約確認 - 博多一瑞亭", title: "ご予約が確定しました", greeting: `${reservation.name} 様`, body: "ご予約の詳細は以下の通りです：", date: "日付", time: "時間", partySize: "人数", course: "コース", amount: "お支払い金額", closing: "ご来店を心よりお待ちしております。", cancelNote: "ご予約のキャンセルをご希望の場合は、以下のリンクからお手続きください。", cancelLink: "予約をキャンセルする", persons: "名" },
          en: { subject: "Reservation Confirmed - Hakata Issuitei", title: "Your reservation is confirmed!", greeting: `Dear ${reservation.name},`, body: "Your reservation details:", date: "Date", time: "Time", partySize: "Party Size", course: "Course", amount: "Amount Paid", closing: "We look forward to seeing you!", cancelNote: "If you need to cancel your reservation, please use the link below.", cancelLink: "Cancel Reservation", persons: " guests" },
          "zh-CN": { subject: "预约确认 - 博多一瑞亭", title: "您的预约已确认！", greeting: `${reservation.name} 您好，`, body: "以下是您的预约详情：", date: "日期", time: "时间", partySize: "人数", course: "套餐", amount: "已付金额", closing: "期待您的光临！", cancelNote: "如需取消预约，请点击以下链接。", cancelLink: "取消预约", persons: "人" },
          "zh-TW": { subject: "預約確認 - 博多一瑞亭", title: "您的預約已確認！", greeting: `${reservation.name} 您好，`, body: "以下是您的預約詳情：", date: "日期", time: "時間", partySize: "人數", course: "套餐", amount: "已付金額", closing: "期待您的光臨！", cancelNote: "如需取消預約，請點擊以下連結。", cancelLink: "取消預約", persons: "人" },
          ko: { subject: "예약 확인 - 하카타 잇스이테이", title: "예약이 확정되었습니다!", greeting: `${reservation.name}님,`, body: "예약 상세 정보:", date: "날짜", time: "시간", partySize: "인원", course: "코스", amount: "결제 금액", closing: "방문을 기다리겠습니다!", cancelNote: "예약을 취소하시려면 아래 링크를 이용해 주세요.", cancelLink: "예약 취소", persons: "명" },
          th: { subject: "ยืนยันการจอง - ฮากาตะ อิสซุยเต", title: "การจองของคุณได้รับการยืนยันแล้ว!", greeting: `เรียน ${reservation.name},`, body: "รายละเอียดการจองของคุณ:", date: "วันที่", time: "เวลา", partySize: "จำนวนคน", course: "คอร์ส", amount: "ยอดชำระ", closing: "เราหวังว่าจะได้พบคุณ!", cancelNote: "หากต้องการยกเลิกการจอง กรุณาใช้ลิงก์ด้านล่าง", cancelLink: "ยกเลิกการจอง", persons: " คน" },
        };
        const et = emailT[lang] || emailT.en;

        const courseNameMap: Record<string, string> = {
          ja: reservation.course?.nameJa || "-",
          en: reservation.course?.nameEn || "-",
          "zh-CN": reservation.course?.nameZhCN || "-",
          "zh-TW": reservation.course?.nameZhTW || "-",
          ko: reservation.course?.nameKo || "-",
          th: reservation.course?.nameTh || "-",
        };

        await resend.emails.send({
          from: FROM_EMAIL,
          to: reservation.email,
          subject: et.subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #d4a853; color: #000; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 20px;">${et.title}</h1>
              </div>
              <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px;">
                <p>${et.greeting}</p>
                <p>${et.body}</p>
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${et.date}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.visitDate.toLocaleDateString(lang === "ja" ? "ja-JP" : lang === "ko" ? "ko-KR" : lang === "th" ? "th-TH" : lang.startsWith("zh") ? "zh-CN" : "en-US")}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${et.time}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.visitTime}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${et.partySize}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.partySize}${et.persons}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${et.course}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${courseNameMap[lang] || courseNameMap.en}</td></tr>
                  <tr><td style="padding: 8px; color: #666;">${et.amount}</td><td style="padding: 8px; font-weight: bold;">¥${reservation.amountPaid?.toLocaleString()}</td></tr>
                </table>
                <p>${et.closing}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 13px; color: #888;">${et.cancelNote}</p>
                <p style="text-align: center; margin: 16px 0;">
                  <a href="${cancelUrl}" style="color: #d4a853; font-size: 13px;">${et.cancelLink}</a>
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
