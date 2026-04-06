"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  reservationId: string;
  currentStatus: string;
  currentNotes: string;
  stripePaymentIntentId: string | null;
};

export function ReservationStatusForm({
  reservationId,
  currentStatus,
  currentNotes,
  stripePaymentIntentId,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [adminNotes, setAdminNotes] = useState(currentNotes);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpdate() {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes }),
    });
    if (res.ok) {
      setMessage("更新しました");
      router.refresh();
    } else {
      setMessage("更新に失敗しました");
    }
    setLoading(false);
  }

  async function handleRefund() {
    if (!confirm("返金処理を実行しますか？")) return;
    setLoading(true);
    const res = await fetch(`/api/reservations/${reservationId}/refund`, {
      method: "POST",
    });
    if (res.ok) {
      setMessage("返金処理を開始しました");
      router.refresh();
    } else {
      setMessage("返金処理に失敗しました");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ステータス変更
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full"
        >
          <option value="PENDING">承認待ち</option>
          <option value="CONFIRMED">確定</option>
          <option value="CANCELLED">キャンセル</option>
          <option value="NO_SHOW">ノーショー</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          管理メモ
        </label>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "更新中..." : "更新"}
        </button>
        {stripePaymentIntentId && (
          <button
            onClick={handleRefund}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            返金処理
          </button>
        )}
      </div>

      {message && (
        <p className="text-sm text-green-600">{message}</p>
      )}
    </div>
  );
}
