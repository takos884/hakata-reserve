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
  "zh-CN": {
    title: "取消预约",
    titleJa: "ご予約キャンセル",
    confirm: "您确定要取消以下预约吗？",
    name: "姓名",
    date: "到店日期",
    time: "时间",
    partySize: "人数",
    amount: "已付金额",
    policyTitle: "取消政策",
    policy: "• 8天以上：免费取消\n• 3-7天前：收取30%费用\n• 1-2天前：收取50%费用\n• 当天/未到：收取100%费用",
    emailLabel: "输入注册邮箱以确认取消",
    emailPlaceholder: "预约时使用的邮箱",
    cancel: "取消预约",
    cancelling: "处理中...",
    cancelled: "取消完成",
    cancelledMsg: "您的预约已被取消。",
    refund: "退款金额",
    fee: "取消费用",
    refundNote: "退款通过Stripe处理，可能需要5-10个工作日到账。",
    home: "返回首页",
    loading: "加载中...",
    notFound: "未找到预约",
    alreadyCancelled: "此预约已取消",
    emailError: "邮箱地址不匹配",
    persons: "人",
  },
  "zh-TW": {
    title: "取消預約",
    titleJa: "ご予約キャンセル",
    confirm: "您確定要取消以下預約嗎？",
    name: "姓名",
    date: "到店日期",
    time: "時間",
    partySize: "人數",
    amount: "已付金額",
    policyTitle: "取消政策",
    policy: "• 8天以上：免費取消\n• 3-7天前：收取30%費用\n• 1-2天前：收取50%費用\n• 當天/未到：收取100%費用",
    emailLabel: "輸入註冊郵箱以確認取消",
    emailPlaceholder: "預約時使用的郵箱",
    cancel: "取消預約",
    cancelling: "處理中...",
    cancelled: "取消完成",
    cancelledMsg: "您的預約已被取消。",
    refund: "退款金額",
    fee: "取消費用",
    refundNote: "退款透過Stripe處理，可能需要5-10個工作日到帳。",
    home: "返回首頁",
    loading: "載入中...",
    notFound: "未找到預約",
    alreadyCancelled: "此預約已取消",
    emailError: "郵箱地址不匹配",
    persons: "人",
  },
  ko: {
    title: "예약 취소",
    titleJa: "ご予約キャンセル",
    confirm: "다음 예약을 취소하시겠습니까?",
    name: "이름",
    date: "방문 날짜",
    time: "시간",
    partySize: "인원수",
    amount: "결제 금액",
    policyTitle: "취소 정책",
    policy: "• 8일 이상 전: 무료 취소\n• 3-7일 전: 30% 수수료\n• 1-2일 전: 50% 수수료\n• 당일/노쇼: 100% 수수료",
    emailLabel: "예약 시 사용한 이메일을 입력하세요",
    emailPlaceholder: "예약 시 이메일",
    cancel: "예약 취소",
    cancelling: "처리 중...",
    cancelled: "취소 완료",
    cancelledMsg: "예약이 취소되었습니다.",
    refund: "환불 금액",
    fee: "취소 수수료",
    refundNote: "환불은 Stripe를 통해 처리됩니다. 반영까지 5-10영업일 소요될 수 있습니다.",
    home: "홈으로 돌아가기",
    loading: "로딩 중...",
    notFound: "예약을 찾을 수 없습니다",
    alreadyCancelled: "이 예약은 이미 취소되었습니다",
    emailError: "이메일이 일치하지 않습니다",
    persons: "명",
  },
  th: {
    title: "ยกเลิกการจอง",
    titleJa: "ご予約キャンセル",
    confirm: "คุณต้องการยกเลิกการจองนี้หรือไม่?",
    name: "ชื่อ",
    date: "วันที่",
    time: "เวลา",
    partySize: "จำนวนคน",
    amount: "ยอดชำระ",
    policyTitle: "นโยบายการยกเลิก",
    policy: "• 8 วันขึ้นไป: ยกเลิกฟรี\n• 3-7 วันก่อน: ค่าธรรมเนียม 30%\n• 1-2 วันก่อน: ค่าธรรมเนียม 50%\n• วันเดียวกัน/ไม่มา: ค่าธรรมเนียม 100%",
    emailLabel: "กรอกอีเมลเพื่อยืนยันการยกเลิก",
    emailPlaceholder: "อีเมลที่ใช้จอง",
    cancel: "ยกเลิกการจอง",
    cancelling: "กำลังดำเนินการ...",
    cancelled: "ยกเลิกเรียบร้อย",
    cancelledMsg: "การจองของคุณถูกยกเลิกแล้ว",
    refund: "ยอดคืนเงิน",
    fee: "ค่าธรรมเนียมยกเลิก",
    refundNote: "การคืนเงินดำเนินการผ่าน Stripe อาจใช้เวลา 5-10 วันทำการ",
    home: "กลับไปหน้าหลัก",
    loading: "กำลังโหลด...",
    notFound: "ไม่พบการจอง",
    alreadyCancelled: "การจองนี้ถูกยกเลิกแล้ว",
    emailError: "อีเมลไม่ตรงกัน",
    persons: "คน",
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
