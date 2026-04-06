import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AgencyActions } from "./agency-actions";

export default async function AgenciesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const inquiries = await prisma.agencyInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const statusLabels: Record<string, string> = {
    NEW: "新規",
    IN_PROGRESS: "対応中",
    CONFIRMED: "確定",
    CANCELLED: "キャンセル",
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">代理店問い合わせ</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">代理店名</th>
              <th className="text-left px-4 py-3">担当者</th>
              <th className="text-left px-4 py-3">来店希望日</th>
              <th className="text-left px-4 py-3">人数</th>
              <th className="text-left px-4 py-3">ステータス</th>
              <th className="text-left px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{inq.agencyName}</td>
                <td className="px-4 py-3">{inq.contactName}</td>
                <td className="px-4 py-3">
                  {inq.visitDate.toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3">{inq.partySize}名</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusColors[inq.status]}`}
                  >
                    {statusLabels[inq.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AgencyActions inquiry={inq} />
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  問い合わせがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
