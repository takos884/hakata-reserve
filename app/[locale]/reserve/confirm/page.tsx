"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type ReservationData = {
  name: string;
  email: string;
  phone?: string;
  nationality?: string;
  visitDate: string;
  visitTime: string;
  partySize: number;
  courseId: string;
  notes?: string;
  lang: string;
};

const confirmLabels: Record<string, Record<string, string>> = {
  en: {
    title: "Confirm Reservation",
    titleJa: "予約内容の確認",
    name: "Full Name",
    email: "Email",
    date: "Visit Date",
    time: "Visit Time",
    partySize: "Party Size",
    phone: "Phone",
    notes: "Notes",
    total: "Total Amount",
    back: "← Edit",
    pay: "Pay & Confirm",
    processing: "Processing...",
    persons: "guests",
  },
  "zh-CN": {
    title: "确认预约",
    titleJa: "予約内容の確認",
    name: "姓名",
    email: "电子邮件",
    date: "到店日期",
    time: "到店时间",
    partySize: "人数",
    phone: "电话",
    notes: "备注",
    total: "合计金额",
    back: "← 修改",
    pay: "支付并确认",
    processing: "处理中...",
    persons: "人",
  },
  "zh-TW": {
    title: "確認預約",
    titleJa: "予約内容の確認",
    name: "姓名",
    email: "電子郵件",
    date: "到店日期",
    time: "到店時間",
    partySize: "人數",
    phone: "電話",
    notes: "備註",
    total: "合計金額",
    back: "← 修改",
    pay: "付款並確認",
    processing: "處理中...",
    persons: "人",
  },
  ko: {
    title: "예약 확인",
    titleJa: "予約内容の確認",
    name: "이름",
    email: "이메일",
    date: "방문 날짜",
    time: "방문 시간",
    partySize: "인원수",
    phone: "전화번호",
    notes: "메모",
    total: "합계 금액",
    back: "← 수정",
    pay: "결제 및 확인",
    processing: "처리 중...",
    persons: "명",
  },
  th: {
    title: "ยืนยันการจอง",
    titleJa: "予約内容の確認",
    name: "ชื่อ-นามสกุล",
    email: "อีเมล",
    date: "วันที่มาร้าน",
    time: "เวลาที่มาร้าน",
    partySize: "จำนวนคน",
    phone: "โทรศัพท์",
    notes: "หมายเหตุ",
    total: "ยอดรวม",
    back: "← แก้ไข",
    pay: "ชำระและยืนยัน",
    processing: "กำลังดำเนินการ...",
    persons: "คน",
  },
};

const rowClass = "flex items-start justify-between py-3 border-b border-[#1f1f1f]";
const labelClass = "text-gray-500 text-xs tracking-widest uppercase w-32 flex-shrink-0";
const valueClass = "text-gray-200 text-sm font-light text-right";

export default function ConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const t = confirmLabels[locale] || confirmLabels.en;

  const [data, setData] = useState<ReservationData | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("reservationData");
    const amount = sessionStorage.getItem("totalAmount");
    if (!stored) {
      router.push(`/${locale}/reserve`);
      return;
    }
    setData(JSON.parse(stored));
    setTotalAmount(Number(amount));
  }, [locale, router]);

  async function handlePayment() {
    if (!data) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to create reservation");
        setLoading(false);
        return;
      }

      const { clientSecret, reservationId } = await res.json();

      const stripe = await stripePromise;
      if (!stripe) {
        setError("Stripe failed to load");
        setLoading(false);
        return;
      }

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: {
              token: undefined as unknown as string,
            },
            billing_details: {
              name: data.name,
              email: data.email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setLoading(false);
        return;
      }

      sessionStorage.removeItem("reservationData");
      sessionStorage.removeItem("totalAmount");
      router.push(`/${locale}/reserve/complete?id=${reservationId}`);
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-20 px-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-2">{t.titleJa}</p>
          <h1 className="text-4xl font-light text-gray-100 tracking-widest mb-4">{t.title}</h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#d4a853]/60" />
            <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
            <div className="h-px w-24 bg-[#333]" />
          </div>
        </div>

        {/* Reservation Summary */}
        <div className="bg-[#111] border border-[#222] p-6 mb-6">
          <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-4 border-b border-[#222] mb-2">
            Reservation Details
          </p>

          <div className="space-y-0">
            <div className={rowClass}>
              <span className={labelClass}>{t.name}</span>
              <span className={valueClass}>{data.name}</span>
            </div>
            <div className={rowClass}>
              <span className={labelClass}>{t.email}</span>
              <span className={`${valueClass} break-all`}>{data.email}</span>
            </div>
            <div className={rowClass}>
              <span className={labelClass}>{t.date}</span>
              <span className={valueClass}>{data.visitDate}</span>
            </div>
            <div className={rowClass}>
              <span className={labelClass}>{t.time}</span>
              <span className={valueClass}>{data.visitTime}</span>
            </div>
            <div className={rowClass}>
              <span className={labelClass}>{t.partySize}</span>
              <span className={valueClass}>{data.partySize} {t.persons}</span>
            </div>
            {data.phone && (
              <div className={rowClass}>
                <span className={labelClass}>{t.phone}</span>
                <span className={valueClass}>{data.phone}</span>
              </div>
            )}
            {data.nationality && (
              <div className={rowClass}>
                <span className={labelClass}>Nationality</span>
                <span className={valueClass}>{data.nationality}</span>
              </div>
            )}
            {data.notes && (
              <div className={`${rowClass} border-b-0`}>
                <span className={labelClass}>{t.notes}</span>
                <span className={`${valueClass} max-w-[60%]`}>{data.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#d4a853]/10 border border-[#d4a853]/30 p-6 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs tracking-widest uppercase">{t.total}</p>
            <p className="text-[#d4a853] text-3xl font-light">
              ¥{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 py-4 border border-[#333] text-gray-400 text-sm tracking-widest uppercase hover:border-[#555] hover:text-gray-200 transition-all"
          >
            {t.back}
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 py-4 bg-[#d4a853] text-black font-semibold tracking-widest text-sm uppercase hover:bg-[#c4963f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t.processing : t.pay}
          </button>
        </div>
      </div>
    </div>
  );
}
