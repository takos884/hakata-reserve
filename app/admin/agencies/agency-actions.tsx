"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Inquiry = {
  id: string;
  agencyName: string;
  contactName: string;
  email: string;
  phone: string;
  tourCode: string | null;
  visitDate: Date;
  partySize: number;
  billingInfo: string;
  notes: string | null;
  status: string;
  stripePaymentLink: string | null;
  stripePaymentIntentId: string | null;
  depositAmount: number | null;
  depositPaid: boolean;
};

export function AgencyActions({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [translatedNotes, setTranslatedNotes] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  const translateNotes = useCallback(async () => {
    if (!inquiry.notes || translatedNotes !== null) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inquiry.notes, targetLang: "ja" }),
      });
      const data = await res.json();
      setTranslatedNotes(data.translated || "翻訳に失敗しました");
    } catch {
      setTranslatedNotes("翻訳に失敗しました");
    }
    setTranslating(false);
  }, [inquiry.notes, translatedNotes]);

  useEffect(() => {
    if (showDetail && inquiry.notes) {
      translateNotes();
    }
  }, [showDetail, inquiry.notes, translateNotes]);

  async function handleStatusChange(status: string) {
    setLoading(true);
    await fetch(`/api/agency-inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  async function handleSendPaymentLink() {
    setLoading(true);
    const res = await fetch(`/api/agency-inquiries/${inquiry.id}/payment-link`, {
      method: "POST",
    });
    if (res.ok) {
      alert("決済リンクを送信しました");
    } else {
      alert("送信に失敗しました");
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="text-orange-600 hover:underline text-sm"
      >
        {showDetail ? "閉じる" : "詳細"}
      </button>

      {inquiry.status === "NEW" && (
        <button
          onClick={() => handleStatusChange("IN_PROGRESS")}
          disabled={loading}
          className="text-blue-600 hover:underline text-sm disabled:opacity-50"
        >
          対応開始
        </button>
      )}

      {inquiry.status === "IN_PROGRESS" && (
        <button
          onClick={handleSendPaymentLink}
          disabled={loading}
          className="text-green-600 hover:underline text-sm disabled:opacity-50"
        >
          決済リンク送信
        </button>
      )}

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{inquiry.agencyName}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">担当者</p>
                <p>{inquiry.contactName}</p>
              </div>
              <div>
                <p className="text-gray-500">メール</p>
                <p>{inquiry.email}</p>
              </div>
              <div>
                <p className="text-gray-500">電話</p>
                <p>{inquiry.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">ツアーコード</p>
                <p>{inquiry.tourCode || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">来店希望日</p>
                <p>{new Date(inquiry.visitDate).toLocaleDateString("ja-JP")}</p>
              </div>
              <div>
                <p className="text-gray-500">人数</p>
                <p>{inquiry.partySize}名</p>
              </div>
              <div>
                <p className="text-gray-500">預り金</p>
                <p>
                  {inquiry.depositAmount
                    ? `¥${inquiry.depositAmount.toLocaleString()}`
                    : "-"}
                  {inquiry.depositPaid ? (
                    <span className="ml-2 text-green-600 text-xs font-medium">済</span>
                  ) : inquiry.depositAmount ? (
                    <span className="ml-2 text-orange-600 text-xs font-medium">未入金</span>
                  ) : null}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">請求先情報</p>
                <p>{inquiry.billingInfo}</p>
              </div>
              {inquiry.notes && (
                <div className="col-span-2 space-y-2">
                  <div>
                    <p className="text-gray-500">特記事項（原文）</p>
                    <p className="bg-gray-50 rounded p-2 whitespace-pre-wrap">{inquiry.notes}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">翻訳（日本語）</p>
                    {translating ? (
                      <p className="text-gray-400 text-sm">翻訳中...</p>
                    ) : (
                      <p className="bg-blue-50 rounded p-2 whitespace-pre-wrap">{translatedNotes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowDetail(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
