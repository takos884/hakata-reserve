import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReservationStatus } from "@prisma/client";

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const params = await searchParams;
  const statusFilter = params.status as ReservationStatus | undefined;
  const dateFilter = params.date;
  const page = parseInt(params.page || "1");
  const perPage = 20;

  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;
  if (dateFilter) {
    const d = new Date(dateFilter);
    where.visitDate = {
      gte: new Date(d.setHours(0, 0, 0, 0)),
      lt: new Date(d.setHours(23, 59, 59, 999)),
    };
  }

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      where,
      include: { course: true },
      orderBy: { visitDate: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.reservation.count({ where }),
  ]);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    NO_SHOW: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "承認待ち",
    CONFIRMED: "確定",
    CANCELLED: "キャンセル",
    NO_SHOW: "ノーショー",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">予約一覧</h1>
        <a
          href="/api/reservations/export"
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
        >
          CSVエクスポート
        </a>
      </div>

      {/* Filters */}
      <form className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-xs text-gray-500 mb-1">ステータス</label>
          <select
            name="status"
            defaultValue={statusFilter || ""}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="">すべて</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">来店日</label>
          <input
            name="date"
            type="date"
            defaultValue={dateFilter || ""}
            className="border rounded px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="px-4 py-1.5 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
          >
            絞り込み
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">予約ID</th>
              <th className="text-left px-4 py-3">氏名</th>
              <th className="text-left px-4 py-3">来店日</th>
              <th className="text-left px-4 py-3">時間</th>
              <th className="text-left px-4 py-3">人数</th>
              <th className="text-left px-4 py-3">コース</th>
              <th className="text-left px-4 py-3">ステータス</th>
              <th className="text-left px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">
                  {r.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">
                  {r.visitDate.toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3">{r.visitTime}</td>
                <td className="px-4 py-3">{r.partySize}名</td>
                <td className="px-4 py-3">{r.course?.nameJa || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${statusColors[r.status]}`}
                  >
                    {statusLabels[r.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/reservations/${r.id}`}
                    className="text-orange-600 hover:underline"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  予約がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > perPage && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(total / perPage) }, (_, i) => (
            <Link
              key={i}
              href={`/admin/reservations?page=${i + 1}${statusFilter ? `&status=${statusFilter}` : ""}${dateFilter ? `&date=${dateFilter}` : ""}`}
              className={`px-3 py-1 rounded text-sm ${
                page === i + 1
                  ? "bg-orange-600 text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
