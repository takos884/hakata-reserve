import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { agencyInquirySchema } from "@/lib/validations";
import { resend, FROM_EMAIL } from "@/lib/mail";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = agencyInquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const inquiry = await prisma.agencyInquiry.create({
    data: {
      agencyName: data.agencyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      tourCode: data.tourCode || null,
      visitDate: new Date(data.visitDate),
      partySize: data.partySize,
      billingInfo: data.billingInfo,
      notes: data.notes || null,
    },
  });

  // Notify store about new inquiry
  await resend.emails.send({
    from: FROM_EMAIL,
    to: process.env.ADMIN_EMAIL!,
    subject: `新規代理店問い合わせ: ${data.agencyName} (${data.partySize}名)`,
    html: `
      <h2>新規代理店問い合わせ</h2>
      <ul>
        <li>代理店名: ${data.agencyName}</li>
        <li>担当者: ${data.contactName}</li>
        <li>メール: ${data.email}</li>
        <li>電話: ${data.phone}</li>
        <li>来店希望日: ${data.visitDate}</li>
        <li>人数: ${data.partySize}名</li>
        <li>ツアーコード: ${data.tourCode || "-"}</li>
      </ul>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/agencies">管理画面で確認</a></p>
    `,
  });

  return NextResponse.json(inquiry, { status: 201 });
}
