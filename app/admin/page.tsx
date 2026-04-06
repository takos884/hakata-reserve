import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const weekEnd = new Date(todayStart.getTime() + 7 * 86400000);

  const [
    totalReservations,
    pendingReservations,
    confirmedReservations,
    cancelledReservations,
    noShowReservations,
    confirmedToday,
    newInquiries,
    totalInquiries,
    totalRevenue,
    upcomingReservations,
    recentReservations,
    recentInquiries,
    weekReservations,
  ] = await Promise.all([
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.reservation.count({ where: { status: "CONFIRMED" } }),
    prisma.reservation.count({ where: { status: "CANCELLED" } }),
    prisma.reservation.count({ where: { status: "NO_SHOW" } }),
    prisma.reservation.count({
      where: {
        status: "CONFIRMED",
        visitDate: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.agencyInquiry.count({ where: { status: "NEW" } }),
    prisma.agencyInquiry.count(),
    prisma.reservation.aggregate({
      _sum: { amountPaid: true },
      where: { status: { in: ["CONFIRMED", "PENDING"] } },
    }),
    prisma.reservation.count({
      where: {
        status: "CONFIRMED",
        visitDate: { gte: todayStart, lt: weekEnd },
      },
    }),
    prisma.reservation.findMany({
      include: { course: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.agencyInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.reservation.findMany({
      where: {
        status: "CONFIRMED",
        visitDate: { gte: todayStart, lt: weekEnd },
      },
      include: { course: true },
      orderBy: { visitDate: "asc" },
      take: 10,
    }),
  ]);

  const revenue = totalRevenue._sum.amountPaid || 0;
  const totalGuests = await prisma.reservation.aggregate({
    _sum: { partySize: true },
    where: { status: "CONFIRMED" },
  });

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    NO_SHOW: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    NEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    IN_PROGRESS: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "承認待ち",
    CONFIRMED: "確定",
    CANCELLED: "キャンセル",
    NO_SHOW: "ノーショー",
    NEW: "新規",
    IN_PROGRESS: "対応中",
  };

  // Calculate status bar widths
  const total = totalReservations || 1;
  const confirmedPct = Math.round((confirmedReservations / total) * 100);
  const pendingPct = Math.round((pendingReservations / total) * 100);
  const cancelledPct = Math.round((cancelledReservations / total) * 100);
  const noShowPct = Math.round((noShowReservations / total) * 100);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-1">
            {now.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/reservations"
            className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
          >
            予約一覧
          </Link>
          <Link
            href="/admin/agencies"
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            問い合わせ
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">総予約数</p>
            <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalReservations}</p>
          <p className="text-xs text-gray-400 mt-1">全期間</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">承認待ち</p>
            <span className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{pendingReservations}</p>
          <p className="text-xs text-gray-400 mt-1">要対応</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">今週の予約</p>
            <span className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-green-600">{upcomingReservations}</p>
          <p className="text-xs text-gray-400 mt-1">本日: {confirmedToday}件</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">売上合計</p>
            <span className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">¥{revenue.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{totalGuests._sum.partySize || 0}名分</p>
        </div>
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <span className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </span>
          <div>
            <p className="text-xl font-bold text-gray-900">{totalInquiries}</p>
            <p className="text-xs text-gray-500">代理店問い合わせ</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <span className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <p className="text-xl font-bold text-gray-900">{newInquiries}</p>
            <p className="text-xs text-gray-500">新規問い合わせ</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <span className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </span>
          <div>
            <p className="text-xl font-bold text-gray-900">{cancelledReservations}</p>
            <p className="text-xs text-gray-500">キャンセル</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <span className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <p className="text-xl font-bold text-gray-900">{noShowReservations}</p>
            <p className="text-xs text-gray-500">ノーショー</p>
          </div>
        </div>
      </div>

      {/* Status Distribution Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">予約ステータス分布</h3>
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
          {confirmedPct > 0 && <div className="bg-green-500 transition-all" style={{ width: `${confirmedPct}%` }} />}
          {pendingPct > 0 && <div className="bg-yellow-500 transition-all" style={{ width: `${pendingPct}%` }} />}
          {cancelledPct > 0 && <div className="bg-red-400 transition-all" style={{ width: `${cancelledPct}%` }} />}
          {noShowPct > 0 && <div className="bg-gray-400 transition-all" style={{ width: `${noShowPct}%` }} />}
        </div>
        <div className="flex gap-6 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-green-500" />確定 {confirmedPct}%</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />承認待ち {pendingPct}%</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />キャンセル {cancelledPct}%</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-gray-400" />ノーショー {noShowPct}%</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Reservations (this week) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">今週の予約スケジュール</h3>
            <Link href="/admin/reservations" className="text-xs text-orange-600 hover:underline">すべて見る →</Link>
          </div>
          {weekReservations.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">今週の確定予約はありません</p>
          ) : (
            <div className="space-y-2">
              {weekReservations.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/reservations/${r.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600">
                      {r.visitDate.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                    </span>
                    <span className="text-xs text-orange-400">{r.visitTime}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.partySize}名 · {r.course?.nameJa || "コース未選択"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">¥{(r.amountPaid || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{r.lang.toUpperCase()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Agency Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">代理店問い合わせ</h3>
            <Link href="/admin/agencies" className="text-xs text-orange-600 hover:underline">すべて →</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">問い合わせはありません</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{inq.agencyName}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[inq.status]}`}>
                      {statusLabels[inq.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{inq.partySize}名 · {inq.visitDate.toLocaleDateString("ja-JP")}</p>
                  <p className="text-xs text-gray-400 mt-1">{inq.contactName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">最近の予約</h3>
          <Link href="/admin/reservations" className="text-xs text-orange-600 hover:underline">すべて見る →</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">予約者</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">来店日</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">人数</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">コース</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">言語</th>
            </tr>
          </thead>
          <tbody>
            {recentReservations.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <Link href={`/admin/reservations/${r.id}`} className="hover:text-orange-600 transition-colors">
                    <p className="font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <p className="text-gray-900">{r.visitDate.toLocaleDateString("ja-JP")}</p>
                  <p className="text-xs text-gray-400">{r.visitTime}</p>
                </td>
                <td className="px-5 py-3 text-gray-900">{r.partySize}名</td>
                <td className="px-5 py-3 text-gray-600">{r.course?.nameJa || "-"}</td>
                <td className="px-5 py-3 font-medium text-gray-900">¥{(r.amountPaid || 0).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[r.status]}`}>
                    {statusLabels[r.status]}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 uppercase">{r.lang}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
