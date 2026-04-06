import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const customers = await prisma.reservation.findMany({
    select: {
      email: true,
      name: true,
      phone: true,
      nationality: true,
      lang: true,
    },
    distinct: ["email"],
    orderBy: { createdAt: "desc" },
  });

  const emailCounts = await prisma.reservation.groupBy({
    by: ["email"],
    _count: true,
  });
  const countMap = new Map(emailCounts.map((c) => [c.email, c._count]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">顧客情報</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">氏名</th>
              <th className="text-left px-4 py-3">メール</th>
              <th className="text-left px-4 py-3">電話番号</th>
              <th className="text-left px-4 py-3">国籍</th>
              <th className="text-left px-4 py-3">言語</th>
              <th className="text-left px-4 py-3">予約回数</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone || "-"}</td>
                <td className="px-4 py-3">{c.nationality || "-"}</td>
                <td className="px-4 py-3">{c.lang}</td>
                <td className="px-4 py-3">{countMap.get(c.email) || 0}回</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  顧客情報がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
