import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed courses
  const courses = [
    {
      nameJa: "博多豚骨ラーメン",
      nameEn: "Hakata Tonkotsu Ramen",
      nameZhCN: "博多豚骨拉面",
      nameZhTW: "博多豚骨拉麵",
      nameKo: "하카타 돈코츠 라멘",
      nameTh: "ราเมนทงคตสึฮากาตะ",
      price: 1200,
      description: "Classic Hakata-style tonkotsu ramen",
    },
    {
      nameJa: "特製豚骨ラーメン",
      nameEn: "Special Tonkotsu Ramen",
      nameZhCN: "特制豚骨拉面",
      nameZhTW: "特製豚骨拉麵",
      nameKo: "특제 돈코츠 라멘",
      nameTh: "ราเมนทงคตสึพิเศษ",
      price: 1500,
      description: "Premium tonkotsu ramen with extra toppings",
    },
    {
      nameJa: "替え玉セット",
      nameEn: "Ramen + Extra Noodles Set",
      nameZhCN: "拉面+加面套餐",
      nameZhTW: "拉麵+加麵套餐",
      nameKo: "라멘 + 추가 면 세트",
      nameTh: "ราเมน + เส้นเพิ่มเซ็ต",
      price: 1600,
      description: "Ramen with one extra noodle refill",
    },
    {
      nameJa: "おまかせコース",
      nameEn: "Chef's Course",
      nameZhCN: "主厨推荐套餐",
      nameZhTW: "主廚推薦套餐",
      nameKo: "셰프 코스",
      nameTh: "คอร์สเชฟแนะนำ",
      price: 3000,
      description: "Full course with appetizer, ramen, and dessert",
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.nameEn.toLowerCase().replace(/\s+/g, "-") },
      update: course,
      create: { id: course.nameEn.toLowerCase().replace(/\s+/g, "-"), ...course },
    });
  }

  console.log("Courses seeded");

  // Seed cancellation policies
  await prisma.cancellationPolicy.deleteMany();
  await prisma.cancellationPolicy.createMany({
    data: [
      { daysBeforeMin: 8, daysBeforeMax: null, feePercent: 0 },
      { daysBeforeMin: 3, daysBeforeMax: 7, feePercent: 30 },
      { daysBeforeMin: 1, daysBeforeMax: 2, feePercent: 50 },
      { daysBeforeMin: 0, daysBeforeMax: 0, feePercent: 100 },
    ],
  });

  console.log("Cancellation policies seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
