import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ReservationStatusForm } from "./status-form";

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!reservation) notFound();

  const statusLabels: Record<string, string> = {
    PENDING: "承認待ち",
    CONFIRMED: "確定",
    CANCELLED: "キャンセル",
    NO_SHOW: "ノーショー",
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">予約詳細</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">予約ID</p>
            <p className="font-mono text-sm">{reservation.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">予約種別</p>
            <p>{reservation.type === "INDIVIDUAL" ? "個人" : "代理店"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">氏名</p>
            <p>{reservation.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">メール</p>
            <p>{reservation.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">電話番号</p>
            <p>{reservation.phone || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">国籍</p>
            <p>{reservation.nationality || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">来店日</p>
            <p>{reservation.visitDate.toLocaleDateString("ja-JP")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">来店時間</p>
            <p>{reservation.visitTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">人数</p>
            <p>{reservation.partySize}名</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">コース</p>
            <p>{reservation.course?.nameJa || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">言語</p>
            <p>{reservation.lang}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">決済額</p>
            <p>{reservation.amountPaid ? `¥${reservation.amountPaid.toLocaleString()}` : "-"}</p>
          </div>
        </div>

        {reservation.notes && (
          <div>
            <p className="text-xs text-gray-500">備考・アレルギー</p>
            <p className="mt-1 p-3 bg-gray-50 rounded">{reservation.notes}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500">管理メモ</p>
          <p className="mt-1 p-3 bg-gray-50 rounded">
            {reservation.adminNotes || "なし"}
          </p>
        </div>

        <hr />

        <ReservationStatusForm
          reservationId={reservation.id}
          currentStatus={reservation.status}
          currentNotes={reservation.adminNotes || ""}
          stripePaymentIntentId={reservation.stripePaymentIntentId}
        />
      </div>
    </div>
  );
}
