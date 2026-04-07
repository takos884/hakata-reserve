"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

const labels: Record<string, Record<string, string>> = {
  ja: {
    title: "予約キャンセル",
    titleJa: "ご予約キャンセル",
    confirm: "以下の予約をキャンセルしますか？",
    name: "お名前",
    date: "ご来店日",
    time: "時間",
    partySize: "人数",
    amount: "お支払い金額",
    policyTitle: "キャンセルポリシー",
    policy: "• 8日以上前：無料キャンセル\n• 3〜7日前：30%のキャンセル料\n• 1〜2日前：50%のキャンセル料\n• 当日・無断キャンセル：100%",
    emailLabel: "登録メールアドレスを入力して確認",
    emailPlaceholder: "予約時のメールアドレス",
    cancel: "予約をキャンセルする",
    cancelling: "処理中...",
    cancelled: "キャンセル完了",
    cancelledMsg: "ご予約がキャンセルされました。",
    refund: "返金額",
    fee: "キャンセル料",
    refundNote: "返金はStripeを通じて処理されます。反映まで5〜10営業日かかる場合があります。",
    home: "ホームに戻る",
    loading: "読み込み中...",
    notFound: "予約が見つかりません",
    alreadyCancelled: "この予約は既にキャンセル済みです",
    emailError: "メールアドレスが一致しません",
    persons: "名",
  },
  en: {
    title: "Cancel Reservation",
    titleJa: "ご予約キャンセル",
    confirm: "Would you like to cancel this reservation?",
    name: "Name",
    date: "Date",
    time: "Time",
    partySize: "Party Size",
    amount: "Amount Paid",
    policyTitle: "Cancellation Policy",
    policy: "• 8+ days before: Free cancellation\n• 3-7 days before: 30% fee\n• 1-2 days before: 50% fee\n• Same day / No-show: 100% fee",
    emailLabel: "Enter your email to confirm cancellation",
    emailPlaceholder: "Email used for reservation",
    cancel: "Cancel Reservation",
    cancelling: "Processing...",
    cancelled: "Cancellation Complete",
    cancelledMsg: "Your reservation has been cancelled.",
    refund: "Refund Amount",
    fee: "Cancellation Fee",
    refundNote: "Refunds are processed through Stripe. It may take 5-10 business days to reflect.",
    home: "Return to Home",
    loading: "Loading...",
    notFound: "Reservation not found",
    alreadyCancelled: "This reservation has already been cancelled",
    emailError: "Email does not match",
    persons: "guests",
  },
};

type Reservation = {
  id: string;
  name: string;
  visitDate: string;
  visitTime: string;
  partySize: number;
  amountPaid: number;
  status: string;
};

export default function CancelPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || "ja";
  const t = labels[locale] || labels.en;
  const reservationId = searchParams.get("id");

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ refundAmount: number; feePercent: number } | null>(null);

  useEffect(() => {
    if (!reservationId) {
      setLoading(false);
      return;
    }
    fetch(`/api/reservations/${reservationId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) setReservation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [reservationId]);

  async function handleCancel() {
    if (!reservationId || !email) return;
    setCancelling(true);
    setError("");

    const res = await fetch(`/api/reservations/${reservationId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setCancelled(true);
      setResult(data);
    } else {
      setError(data.error === "Email does not match" ? t.emailError : data.error);
    }
    setCancelling(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center">
        <p className="text-gray-500">{t.loading}</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center">
        <p className="text-gray-500">{t.notFound}</p>
      </div>
    );
  }

  if (cancelled && result) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 border border-gray-600 flex items-center justify-center mx-auto mb-10">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-gray-100 tracking-widest mb-6">{t.cancelled}</h1>
          <div className="bg-[#111] border border-[#222] p-6 mb-8 text-left">
            <p className="text-gray-400 text-sm mb-4">{t.cancelledMsg}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.fee}</span>
                <span className="text-gray-200">{result.feePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.refund}</span>
                <span className="text-[#d4a853] font-medium">¥{result.refundAmount.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-4">{t.refundNote}</p>
          </div>
          <Link
            href={`/${locale}`}
            className="inline-block px-10 py-4 border border-[#d4a853]/50 text-[#d4a853] text-sm font-light tracking-widest uppercase hover:bg-[#d4a853]/10 transition-colors"
          >
            {t.home}
          </Link>
        </div>
      </div>
    );
  }

  const visitDate = new Date(reservation.visitDate);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-12">
          <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-2">{t.titleJa}</p>
          <h1 className="text-4xl font-light text-gray-100 tracking-widest mb-4">{t.title}</h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#d4a853]/60" />
            <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
            <div className="h-px w-24 bg-[#333]" />
          </div>
        </div>

        {reservation.status === "CANCELLED" ? (
          <div className="bg-[#111] border border-[#222] p-6 text-center">
            <p className="text-gray-400">{t.alreadyCancelled}</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-6">{t.confirm}</p>

            <div className="bg-[#111] border border-[#222] p-6 mb-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                  <span className="text-gray-500">{t.name}</span>
                  <span className="text-gray-200">{reservation.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                  <span className="text-gray-500">{t.date}</span>
                  <span className="text-gray-200">{visitDate.toLocaleDateString("ja-JP")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                  <span className="text-gray-500">{t.time}</span>
                  <span className="text-gray-200">{reservation.visitTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                  <span className="text-gray-500">{t.partySize}</span>
                  <span className="text-gray-200">{reservation.partySize} {t.persons}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">{t.amount}</span>
                  <span className="text-gray-200">¥{(reservation.amountPaid || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-[#222] p-6 mb-6">
              <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase mb-3">{t.policyTitle}</p>
              <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed">{t.policy}</p>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-gray-400 tracking-widest uppercase mb-2">
                {t.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full bg-[#1c1c1c] border border-[#333] text-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a853] placeholder-gray-600"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
                {error}
              </div>
            )}

            <button
              onClick={handleCancel}
              disabled={cancelling || !email}
              className="w-full py-4 bg-red-600 text-white font-semibold tracking-widest text-sm uppercase hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelling ? t.cancelling : t.cancel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
