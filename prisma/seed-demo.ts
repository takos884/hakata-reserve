import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get course IDs
  const courses = await prisma.course.findMany();
  const courseIds = courses.map((c) => c.id);

  // Create demo reservations
  const reservations = [
    {
      type: "INDIVIDUAL" as const,
      status: "CONFIRMED" as const,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1-555-0101",
      nationality: "USA",
      visitDate: new Date("2026-04-10T00:00:00Z"),
      visitTime: "18:00",
      partySize: 4,
      courseId: courseIds[1],
      notes: "No pork bone allergy, but one person is vegetarian",
      lang: "en",
      amountPaid: 6000,
      stripePaymentIntentId: "pi_demo_001",
      adminNotes: "VIP guest - hotel concierge referral",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "CONFIRMED" as const,
      name: "王明",
      email: "wang.ming@example.com",
      phone: "+86-138-0000-1234",
      nationality: "China",
      visitDate: new Date("2026-04-10T00:00:00Z"),
      visitTime: "12:00",
      partySize: 2,
      courseId: courseIds[0],
      lang: "zh-CN",
      amountPaid: 2400,
      stripePaymentIntentId: "pi_demo_002",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "PENDING" as const,
      name: "김서연",
      email: "kim.seoyeon@example.com",
      phone: "+82-10-1234-5678",
      nationality: "South Korea",
      visitDate: new Date("2026-04-11T00:00:00Z"),
      visitTime: "19:00",
      partySize: 6,
      courseId: courseIds[2],
      notes: "Birthday celebration - can you prepare a small cake?",
      lang: "ko",
      amountPaid: 9600,
      stripePaymentIntentId: "pi_demo_003",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "CONFIRMED" as const,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+44-7700-900123",
      nationality: "UK",
      visitDate: new Date("2026-04-09T00:00:00Z"),
      visitTime: "11:30",
      partySize: 2,
      courseId: courseIds[3],
      lang: "en",
      amountPaid: 6000,
      stripePaymentIntentId: "pi_demo_004",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "CANCELLED" as const,
      name: "สมชาย ใจดี",
      email: "somchai@example.com",
      phone: "+66-81-234-5678",
      nationality: "Thailand",
      visitDate: new Date("2026-04-08T00:00:00Z"),
      visitTime: "18:30",
      partySize: 3,
      courseId: courseIds[1],
      lang: "th",
      amountPaid: 4500,
      stripePaymentIntentId: "pi_demo_005",
      adminNotes: "Cancelled due to flight change. Refund processed.",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "CONFIRMED" as const,
      name: "李偉",
      email: "li.wei@example.com",
      phone: "+852-9876-5432",
      nationality: "Hong Kong",
      visitDate: new Date("2026-04-12T00:00:00Z"),
      visitTime: "12:30",
      partySize: 8,
      courseId: courseIds[3],
      notes: "Allergy: shellfish",
      lang: "zh-TW",
      amountPaid: 24000,
      stripePaymentIntentId: "pi_demo_006",
      adminNotes: "Large group - reserved corner seating",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "CONFIRMED" as const,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      nationality: "Australia",
      visitDate: new Date("2026-04-06T00:00:00Z"),
      visitTime: "19:30",
      partySize: 2,
      courseId: courseIds[0],
      lang: "en",
      amountPaid: 2400,
      stripePaymentIntentId: "pi_demo_007",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "NO_SHOW" as const,
      name: "田中太郎",
      email: "tanaka@example.com",
      phone: "+81-90-1234-5678",
      nationality: "Japan",
      visitDate: new Date("2026-04-05T00:00:00Z"),
      visitTime: "20:00",
      partySize: 1,
      courseId: courseIds[0],
      lang: "en",
      amountPaid: 1200,
      stripePaymentIntentId: "pi_demo_008",
      adminNotes: "No show - attempted to contact, no response",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "PENDING" as const,
      name: "Maria Garcia",
      email: "maria.g@example.com",
      phone: "+34-612-345-678",
      nationality: "Spain",
      visitDate: new Date("2026-04-13T00:00:00Z"),
      visitTime: "13:00",
      partySize: 5,
      courseId: courseIds[2],
      notes: "Gluten-free option needed for 1 person",
      lang: "en",
      amountPaid: 8000,
      stripePaymentIntentId: "pi_demo_009",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "CONFIRMED" as const,
      name: "陳美玲",
      email: "chen.ml@example.com",
      phone: "+886-912-345-678",
      nationality: "Taiwan",
      visitDate: new Date("2026-04-07T00:00:00Z"),
      visitTime: "11:00",
      partySize: 4,
      courseId: courseIds[1],
      lang: "zh-TW",
      amountPaid: 6000,
      stripePaymentIntentId: "pi_demo_010",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "CONFIRMED" as const,
      name: "Yuki Tanaka",
      email: "yuki.t@example.com",
      nationality: "USA",
      visitDate: new Date("2026-04-14T00:00:00Z"),
      visitTime: "18:00",
      partySize: 3,
      courseId: courseIds[3],
      lang: "en",
      amountPaid: 9000,
      stripePaymentIntentId: "pi_demo_011",
    },
    {
      type: "INDIVIDUAL" as const,
      status: "PENDING" as const,
      name: "박지훈",
      email: "park.jh@example.com",
      phone: "+82-10-9876-5432",
      nationality: "South Korea",
      visitDate: new Date("2026-04-15T00:00:00Z"),
      visitTime: "19:00",
      partySize: 2,
      courseId: courseIds[0],
      lang: "ko",
      amountPaid: 2400,
      stripePaymentIntentId: "pi_demo_012",
    },
  ];

  for (const r of reservations) {
    await prisma.reservation.create({ data: r });
  }
  console.log(`${reservations.length} reservations created`);

  // Create demo agency inquiries
  const inquiries = [
    {
      agencyName: "Japan Travel Bureau (JTB)",
      contactName: "Kenji Yamamoto",
      email: "k.yamamoto@jtb-demo.com",
      phone: "+81-3-1234-5678",
      tourCode: "JTB-TK-2026-0412",
      visitDate: new Date("2026-04-12T12:00:00Z"),
      partySize: 25,
      billingInfo: "JTB Corp.\n2-3-11 Higashishinagawa, Shinagawa-ku, Tokyo\nTax ID: T1234567890",
      notes: "Tour group from Taiwan. Need vegetarian option for 3 guests. Bus will arrive at 11:45.",
      status: "IN_PROGRESS" as const,
    },
    {
      agencyName: "HIS International Tours",
      contactName: "Lisa Chen",
      email: "l.chen@his-demo.com",
      phone: "+852-2851-1234",
      tourCode: "HIS-HK-0415",
      visitDate: new Date("2026-04-15T18:00:00Z"),
      partySize: 15,
      billingInfo: "HIS International Travel\n36/F, Tower Two, Times Square\n1 Matheson Street, Causeway Bay, Hong Kong",
      notes: "Hong Kong food tour group. They specifically requested tonkotsu ramen experience.",
      status: "NEW" as const,
    },
    {
      agencyName: "Klook Travel",
      contactName: "Min-ji Park",
      email: "minji.park@klook-demo.com",
      phone: "+82-2-1234-5678",
      tourCode: "KLK-SEL-0420",
      visitDate: new Date("2026-04-20T11:30:00Z"),
      partySize: 30,
      billingInfo: "Klook Travel Technology\nGangnam Finance Center\n152 Teheran-ro, Gangnam-gu, Seoul",
      notes: "Korean university student group. Budget-friendly option preferred. 2 halal diet requests.",
      status: "NEW" as const,
    },
    {
      agencyName: "Viator / TripAdvisor",
      contactName: "Tom Baker",
      email: "t.baker@viator-demo.com",
      phone: "+1-617-555-0199",
      tourCode: "VTR-US-0418",
      visitDate: new Date("2026-04-18T19:00:00Z"),
      partySize: 12,
      billingInfo: "Viator Inc.\n400 1st Ave, Needham, MA 02494, USA\nTax ID: US-98765432",
      notes: "American food blogger group tour. Photography permitted? They'll post reviews on TripAdvisor.",
      status: "CONFIRMED" as const,
      stripePaymentLink: "https://buy.stripe.com/demo_link_001",
    },
  ];

  for (const inq of inquiries) {
    await prisma.agencyInquiry.create({ data: inq });
  }
  console.log(`${inquiries.length} agency inquiries created`);

  // Add some blocked dates
  const blockedDates = [
    { date: new Date("2026-04-29T00:00:00Z"), note: "昭和の日 (Showa Day)" },
    { date: new Date("2026-05-03T00:00:00Z"), note: "憲法記念日 (Constitution Day)" },
    { date: new Date("2026-05-04T00:00:00Z"), note: "みどりの日 (Greenery Day)" },
    { date: new Date("2026-05-05T00:00:00Z"), note: "こどもの日 (Children's Day)" },
    { date: new Date("2026-12-31T00:00:00Z"), note: "年末休業" },
    { date: new Date("2027-01-01T00:00:00Z"), note: "元日" },
    { date: new Date("2027-01-02T00:00:00Z"), note: "正月休業" },
    { date: new Date("2027-01-03T00:00:00Z"), note: "正月休業" },
  ];

  for (const bd of blockedDates) {
    await prisma.blockedDate.upsert({
      where: { date: bd.date },
      update: bd,
      create: bd,
    });
  }
  console.log(`${blockedDates.length} blocked dates created`);

  console.log("Demo data seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
