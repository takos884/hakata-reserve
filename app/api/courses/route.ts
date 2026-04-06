import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const fallbackCourses = [
  {
    id: "hakata-tonkotsu-ramen",
    nameJa: "博多豚骨ラーメン",
    nameEn: "Hakata Tonkotsu Ramen",
    nameZhCN: "博多豚骨拉面",
    nameZhTW: "博多豚骨拉麵",
    nameKo: "하카타 돈코츠 라멘",
    nameTh: "ราเมนทงคตสึฮากาตะ",
    price: 1200,
    description: "Classic Hakata-style tonkotsu ramen",
    isActive: true,
  },
  {
    id: "special-tonkotsu-ramen",
    nameJa: "特製豚骨ラーメン",
    nameEn: "Special Tonkotsu Ramen",
    nameZhCN: "特制豚骨拉面",
    nameZhTW: "特製豚骨拉麵",
    nameKo: "특제 돈코츠 라멘",
    nameTh: "ราเมนทงคตสึพิเศษ",
    price: 1500,
    description: "Premium tonkotsu ramen with extra toppings",
    isActive: true,
  },
  {
    id: "ramen-extra-noodles-set",
    nameJa: "替え玉セット",
    nameEn: "Ramen + Extra Noodles Set",
    nameZhCN: "拉面+加面套餐",
    nameZhTW: "拉麵+加麵套餐",
    nameKo: "라멘 + 추가 면 세트",
    nameTh: "ราเมน + เส้นเพิ่มเซ็ต",
    price: 1600,
    description: "Ramen with one extra noodle refill",
    isActive: true,
  },
  {
    id: "chefs-course",
    nameJa: "おまかせコース",
    nameEn: "Chef's Course",
    nameZhCN: "主厨推荐套餐",
    nameZhTW: "主廚推薦套餐",
    nameKo: "셰프 코스",
    nameTh: "คอร์สเชฟแนะนำ",
    price: 3000,
    description: "Full course with appetizer, ramen, and dessert",
    isActive: true,
  },
];

function isDbConfigured() {
  const url = process.env.DATABASE_URL || "";
  return url.length > 0 && !url.includes("placeholder");
}

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(fallbackCourses);
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(courses.length > 0 ? courses : fallbackCourses);
  } catch {
    return NextResponse.json(fallbackCourses);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prisma } = await import("@/lib/prisma");
  const body = await request.json();
  const course = await prisma.course.create({ data: body });
  return NextResponse.json(course, { status: 201 });
}
