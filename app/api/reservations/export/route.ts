import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reservations = await prisma.reservation.findMany({
    include: { course: true },
    orderBy: { visitDate: "desc" },
  });

  const header = "予約ID,種別,ステータス,氏名,メール,電話,来店日,時間,人数,コース,決済額,備考\n";
  const rows = reservations.map((r) =>
    [
      r.id,
      r.type === "INDIVIDUAL" ? "個人" : "代理店",
      r.status,
      r.name,
      r.email,
      r.phone || "",
      r.visitDate.toISOString().split("T")[0],
      r.visitTime,
      r.partySize,
      r.course?.nameJa || "",
      r.amountPaid || "",
      (r.notes || "").replace(/,/g, " "),
    ].join(",")
  );

  const csv = header + rows.join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=reservations_${new Date().toISOString().split("T")[0]}.csv`,
    },
  });
}
