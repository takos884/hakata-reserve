"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const labels: Record<string, Record<string, string>> = {
  ja: {
    title: "預り金のお支払い",
    titleJa: "預り金決済",
    depositLabel: "預り金",
    depositNote: "予約確定のため、預り金 ¥20,000 のお支払いをお願いいたします。預り金はご来店時にご利用代金から差し引かれます。",
    agencyName: "代理店名",
    contactName: "担当者",
    visitDate: "来店希望日",
    partySize: "人数",
    back: "← 戻る",
    pay: "預り金を支払う",
    processing: "処理中...",
    error: "決済に失敗しました",
  },
  en: {
    title: "Deposit Payment",
    titleJa: "預り金決済",
    depositLabel: "Deposit",
    depositNote: "A deposit of ¥20,000 is required to confirm your reservation. The deposit will be deducted from the final bill on the day of your visit.",
    agencyName: "Agency Name",
    contactName: "Contact Person",
    visitDate: "Visit Date",
    partySize: "Party Size",
    back: "← Back",
    pay: "Pay Deposit",
    processing: "Processing...",
    error: "Payment failed",
  },
  "zh-CN": {
    title: "预付定金",
    titleJa: "預り金決済",
    depositLabel: "定金",
    depositNote: "为确认您的预约，请支付 ¥20,000 定金。定金将在您来店当天从消费金额中扣除。",
    agencyName: "旅行社名称",
    contactName: "联系人",
    visitDate: "到店日期",
    partySize: "人数",
    back: "← 返回",
    pay: "支付定金",
    processing: "处理中...",
    error: "支付失败",
  },
  "zh-TW": {
    title: "預付訂金",
    titleJa: "預り金決済",
    depositLabel: "訂金",
    depositNote: "為確認您的預約，請支付 ¥20,000 訂金。訂金將在您來店當天從消費金額中扣除。",
    agencyName: "旅行社名稱",
    contactName: "聯絡人",
    visitDate: "到店日期",
    partySize: "人數",
    back: "← 返回",
    pay: "支付訂金",
    processing: "處理中...",
    error: "支付失敗",
  },
  ko: {
    title: "보증금 결제",
    titleJa: "預り金決済",
    depositLabel: "보증금",
    depositNote: "예약 확정을 위해 ¥20,000의 보증금 결제가 필요합니다. 보증금은 방문 당일 이용 금액에서 차감됩니다.",
    agencyName: "여행사 이름",
    contactName: "담당자",
    visitDate: "방문 날짜",
    partySize: "인원수",
    back: "← 뒤로",
    pay: "보증금 결제",
    processing: "처리 중...",
    error: "결제 실패",
  },
  th: {
    title: "ชำระเงินมัดจำ",
    titleJa: "預り金決済",
    depositLabel: "เงินมัดจำ",
    depositNote: "กรุณาชำระเงินมัดจำ ¥20,000 เพื่อยืนยันการจอง เงินมัดจำจะถูกหักจากยอดรวมในวันที่มาร้าน",
    agencyName: "ชื่อบริษัททัวร์",
    contactName: "ผู้ติดต่อ",
    visitDate: "วันที่มาร้าน",
    partySize: "จำนวนคน",
    back: "← กลับ",
    pay: "ชำระเงินมัดจำ",
    processing: "กำลังดำเนินการ...",
    error: "การชำระเงินล้มเหลว",
  },
};

type AgencyData = {
  agencyName: string;
  contactName: string;
  email: string;
  phone: string;
  tourCode?: string;
  visitDate: string;
  partySize: number;
  billingInfo: string;
  notes?: string;
};

function CheckoutForm({ locale, agencyData, onSuccess }: {
  locale: string;
  agencyData: AgencyData;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = labels[locale] || labels.en;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || t.error);
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/agency/complete`,
        payment_method_data: {
          billing_details: {
            name: agencyData.contactName,
            email: agencyData.email,
          },
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message || t.error);
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#111] border border-[#222] p-6">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-[#d4a853] text-black font-semibold tracking-widest text-sm uppercase hover:bg-[#c4963f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t.processing : t.pay}
      </button>
    </form>
  );
}

export default function AgencyConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "ja";
  const t = labels[locale] || labels.en;

  const [agencyData, setAgencyData] = useState<AgencyData | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("agencyData");
    if (!stored) {
      router.push(`/${locale}/agency`);
      return;
    }

    const data = JSON.parse(stored) as AgencyData;
    setAgencyData(data);

    // Submit inquiry and get clientSecret
    fetch("/api/agency-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.clientSecret) {
          setClientSecret(result.clientSecret);
          sessionStorage.setItem("agencyInquiryId", result.inquiryId);
        } else {
          setError(result.error || "Failed to create inquiry");
        }
      })
      .catch(() => setError("An error occurred"));
  }, [locale, router]);

  if (!agencyData) return null;

  const rowClass = "flex items-start justify-between py-3 border-b border-[#1f1f1f]";
  const labelClass = "text-gray-500 text-xs tracking-widest uppercase w-32 flex-shrink-0";
  const valueClass = "text-gray-200 text-sm font-light text-right";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-20 px-6">
      <div className="max-w-xl mx-auto">

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="inline-block text-gray-500 text-xs tracking-widest hover:text-[#d4a853] transition-colors mb-12"
        >
          {t.back}
        </button>

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

        {/* Summary */}
        <div className="bg-[#111] border border-[#222] p-6 mb-6">
          <div className={rowClass}>
            <span className={labelClass}>{t.agencyName}</span>
            <span className={valueClass}>{agencyData.agencyName}</span>
          </div>
          <div className={rowClass}>
            <span className={labelClass}>{t.contactName}</span>
            <span className={valueClass}>{agencyData.contactName}</span>
          </div>
          <div className={rowClass}>
            <span className={labelClass}>{t.visitDate}</span>
            <span className={valueClass}>{agencyData.visitDate}</span>
          </div>
          <div className={`${rowClass} border-b-0`}>
            <span className={labelClass}>{t.partySize}</span>
            <span className={valueClass}>{agencyData.partySize}</span>
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="bg-[#d4a853]/10 border border-[#d4a853]/30 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs tracking-widest uppercase">{t.depositLabel}</p>
            <p className="text-[#d4a853] text-3xl font-light">¥20,000</p>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">{t.depositNote}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Stripe Payment Form */}
        {clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#d4a853",
                  colorBackground: "#1c1c1c",
                  colorText: "#e5e5e5",
                  colorDanger: "#ef4444",
                  borderRadius: "0px",
                },
              },
            }}
          >
            <CheckoutForm
              locale={locale}
              agencyData={agencyData}
              onSuccess={() => {
                sessionStorage.removeItem("agencyData");
              }}
            />
          </Elements>
        ) : !error ? (
          <div className="text-center py-8 text-gray-500 text-sm">Loading payment form...</div>
        ) : null}
      </div>
    </div>
  );
}
