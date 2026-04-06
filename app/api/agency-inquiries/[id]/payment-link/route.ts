import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { resend, FROM_EMAIL } from "@/lib/mail";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const inquiry = await prisma.agencyInquiry.findUnique({ where: { id } });

  if (!inquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Create Stripe Payment Link
  const price = await stripe.prices.create({
    currency: "jpy",
    unit_amount: inquiry.partySize * 1500, // Example: 1500 yen per person
    product_data: {
      name: `Reservation - ${inquiry.agencyName} (${inquiry.partySize} guests)`,
    },
  });

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    metadata: { inquiryId: inquiry.id },
  });

  // Update inquiry with payment link
  await prisma.agencyInquiry.update({
    where: { id },
    data: {
      stripePaymentLink: paymentLink.url,
      status: "IN_PROGRESS",
    },
  });

  // Send email to agency
  await resend.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    subject: "Payment Link for Your Reservation - Hakata Issuitei",
    html: `
      <h2>Payment Link for Your Reservation</h2>
      <p>Dear ${inquiry.contactName},</p>
      <p>Thank you for your reservation inquiry. Please complete the payment using the link below:</p>
      <p><a href="${paymentLink.url}" style="display:inline-block;padding:12px 24px;background:#ea580c;color:white;text-decoration:none;border-radius:6px;">Complete Payment</a></p>
      <p>Party size: ${inquiry.partySize} guests</p>
      <p>Visit date: ${inquiry.visitDate.toLocaleDateString("en-US")}</p>
      <br/>
      <p>Hakata Issuitei</p>
    `,
  });

  return NextResponse.json({ paymentLink: paymentLink.url });
}
