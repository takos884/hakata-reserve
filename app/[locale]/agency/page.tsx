"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agencyInquirySchema, type AgencyInquiryInput } from "@/lib/validations";
import Link from "next/link";

const agencyLabels: Record<string, Record<string, string>> = {
  ja: {
    title: "旅行代理店予約",
    titleJa: "旅行代理店予約",
    subtitle: "9名様以上の団体のお客様",
    back: "← 戻る",
    agencyName: "旅行代理店名",
    contactName: "担当者名",
    email: "メールアドレス",
    phone: "電話番号",
    tourCode: "ツアーコード",
    partySize: "人数（9名以上）",
    visitDate: "ご希望の来店日時",
    billingInfo: "請求先情報",
    billingPlaceholder: "会社名、住所、インボイス番号...",
    notes: "備考",
    notesPlaceholder: "アレルギー、食事制限、特別なご要望...",
    submit: "お問い合わせを送信",
    submitting: "送信中...",
    successTitle: "お問い合わせ受付完了",
    successTitleJa: "お問い合わせ受付完了",
    successBody: "お問い合わせありがとうございます。内容を確認の上、お支払いリンクをお送りいたします。",
    backHome: "ホームに戻る",
    sectionAgency: "代理店情報",
    sectionVisit: "ご来店情報",
    sectionBilling: "請求先・備考",
    placeholderAgency: "株式会社○○旅行",
    placeholderContact: "山田 太郎",
    placeholderEmail: "contact@agency.com",
    placeholderPhone: "+81...",
    placeholderTourCode: "例: JPN-2024-001",
  },
  en: {
    title: "Travel Agency Reservation",
    titleJa: "旅行代理店予約",
    subtitle: "For groups of 9 or more guests",
    back: "← Back",
    agencyName: "Agency Name",
    contactName: "Contact Person",
    email: "Email",
    phone: "Phone",
    tourCode: "Tour Code",
    partySize: "Party Size (9+)",
    visitDate: "Preferred Visit Date & Time",
    billingInfo: "Billing Information",
    billingPlaceholder: "Company name, address, tax ID...",
    notes: "Special Notes",
    notesPlaceholder: "Allergies, dietary requirements, special arrangements...",
    submit: "Submit Inquiry",
    submitting: "Submitting...",
    successTitle: "Inquiry Submitted",
    successTitleJa: "お問い合わせ受付完了",
    successBody: "Thank you for your inquiry. Our team will review your request and send you a payment link once confirmed.",
    backHome: "Return to Home",
  },
  "zh-CN": {
    title: "旅行社预约",
    titleJa: "旅行代理店予約",
    subtitle: "适用于9人以上团体",
    back: "← 返回",
    agencyName: "旅行社名称",
    contactName: "联系人",
    email: "电子邮件",
    phone: "电话",
    tourCode: "团号",
    partySize: "人数（9人以上）",
    visitDate: "希望到店日期和时间",
    billingInfo: "账单信息",
    billingPlaceholder: "公司名称、地址、税号...",
    notes: "特殊备注",
    notesPlaceholder: "过敏、饮食要求、特殊安排...",
    submit: "提交咨询",
    submitting: "提交中...",
    successTitle: "咨询已提交",
    successTitleJa: "お問い合わせ受付完了",
    successBody: "感谢您的咨询。我们的团队将审核您的请求，并在确认后发送付款链接。",
    backHome: "返回首页",
  },
  "zh-TW": {
    title: "旅行社預約",
    titleJa: "旅行代理店予約",
    subtitle: "適用於9人以上團體",
    back: "← 返回",
    agencyName: "旅行社名稱",
    contactName: "聯絡人",
    email: "電子郵件",
    phone: "電話",
    tourCode: "團號",
    partySize: "人數（9人以上）",
    visitDate: "希望到店日期和時間",
    billingInfo: "帳單資訊",
    billingPlaceholder: "公司名稱、地址、統一編號...",
    notes: "特殊備註",
    notesPlaceholder: "過敏、飲食要求、特殊安排...",
    submit: "提交諮詢",
    submitting: "提交中...",
    successTitle: "諮詢已提交",
    successTitleJa: "お問い合わせ受付完了",
    successBody: "感謝您的諮詢。我們的團隊將審核您的請求，並在確認後發送付款連結。",
    backHome: "返回首頁",
  },
  ko: {
    title: "여행사 예약",
    titleJa: "旅行代理店予約",
    subtitle: "9명 이상 단체를 위한 서비스",
    back: "← 뒤로",
    agencyName: "여행사 이름",
    contactName: "담당자",
    email: "이메일",
    phone: "전화번호",
    tourCode: "투어 코드",
    partySize: "인원수 (9명 이상)",
    visitDate: "희망 방문 날짜 및 시간",
    billingInfo: "청구 정보",
    billingPlaceholder: "회사명, 주소, 사업자 번호...",
    notes: "특별 요청",
    notesPlaceholder: "알레르기, 식이 요건, 특별 준비...",
    submit: "문의 제출",
    submitting: "제출 중...",
    successTitle: "문의가 접수되었습니다",
    successTitleJa: "お問い合わせ受付完了",
    successBody: "문의해 주셔서 감사합니다. 담당 팀이 요청을 검토한 후 결제 링크를 보내드리겠습니다.",
    backHome: "홈으로 돌아가기",
  },
  th: {
    title: "การจองสำหรับบริษัททัวร์",
    titleJa: "旅行代理店予約",
    subtitle: "สำหรับกลุ่ม 9 คนขึ้นไป",
    back: "← กลับ",
    agencyName: "ชื่อบริษัททัวร์",
    contactName: "ผู้ติดต่อ",
    email: "อีเมล",
    phone: "โทรศัพท์",
    tourCode: "รหัสทัวร์",
    partySize: "จำนวนคน (9 คนขึ้นไป)",
    visitDate: "วันและเวลาที่ต้องการเยี่ยมชม",
    billingInfo: "ข้อมูลการออกใบแจ้งหนี้",
    billingPlaceholder: "ชื่อบริษัท ที่อยู่ เลขประจำตัวผู้เสียภาษี...",
    notes: "หมายเหตุพิเศษ",
    notesPlaceholder: "อาการแพ้ ข้อกำหนดด้านอาหาร การจัดเตรียมพิเศษ...",
    submit: "ส่งคำขอ",
    submitting: "กำลังส่ง...",
    successTitle: "ส่งคำขอแล้ว",
    successTitleJa: "お問い合わせ受付完了",
    successBody: "ขอบคุณสำหรับคำขอของคุณ ทีมงานของเราจะตรวจสอบคำขอและส่งลิงก์ชำระเงินให้หลังจากยืนยัน",
    backHome: "กลับไปหน้าหลัก",
  },
};

const inputClass =
  "w-full bg-[#1c1c1c] border border-[#333] text-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853]/30 placeholder-gray-600 transition-colors";

const labelClass = "block text-xs text-gray-400 tracking-widest uppercase mb-2";

export default function AgencyPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const t = agencyLabels[locale] || agencyLabels.en;
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgencyInquiryInput>({
    resolver: zodResolver(agencyInquirySchema),
    defaultValues: { partySize: 10 },
  });

  async function onSubmit(data: AgencyInquiryInput) {
    setError("");
    // Save to sessionStorage and redirect to deposit payment page
    sessionStorage.setItem("agencyData", JSON.stringify(data));
    router.push(`/${locale}/agency/confirm`);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-20 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back link */}
        <Link
          href={`/${locale}`}
          className="inline-block text-gray-500 text-xs tracking-widest hover:text-[#d4a853] transition-colors mb-12"
        >
          {t.back}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-2">{t.titleJa}</p>
          <h1 className="text-4xl font-light text-gray-100 tracking-widest mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm tracking-wider mb-4">{t.subtitle}</p>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#d4a853]/60" />
            <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
            <div className="h-px w-24 bg-[#333]" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Agency Info */}
          <div className="bg-[#111] border border-[#222] p-6 space-y-5">
            <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-3 border-b border-[#222]">
              {t.sectionAgency || "Agency Information"}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t.agencyName} *</label>
                <input
                  {...register("agencyName")}
                  className={inputClass}
                  placeholder="Agency Co., Ltd."
                />
                {errors.agencyName && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.agencyName.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>{t.contactName} *</label>
                <input
                  {...register("contactName")}
                  className={inputClass}
                  placeholder="Tanaka Taro"
                />
                {errors.contactName && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.contactName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t.email} *</label>
                <input
                  {...register("email")}
                  type="email"
                  className={inputClass}
                  placeholder="contact@agency.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>{t.phone} *</label>
                <input
                  {...register("phone")}
                  className={inputClass}
                  placeholder="+81..."
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="bg-[#111] border border-[#222] p-6 space-y-5">
            <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-3 border-b border-[#222]">
              {t.sectionVisit || "Visit Details"}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t.tourCode}</label>
                <input
                  {...register("tourCode")}
                  className={inputClass}
                  placeholder="e.g. JPN-2024-001"
                />
              </div>
              <div>
                <label className={labelClass}>{t.partySize} *</label>
                <input
                  {...register("partySize", { valueAsNumber: true })}
                  type="number"
                  min={9}
                  className={inputClass}
                />
                {errors.partySize && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.partySize.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>{t.visitDate} *</label>
              <input
                {...register("visitDate")}
                type="datetime-local"
                className={inputClass}
              />
              {errors.visitDate && (
                <p className="text-red-400 text-xs mt-1.5">{errors.visitDate.message}</p>
              )}
            </div>
          </div>

          {/* Billing & Notes */}
          <div className="bg-[#111] border border-[#222] p-6 space-y-5">
            <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-3 border-b border-[#222]">
              {t.sectionBilling || "Billing & Notes"}
            </p>

            <div>
              <label className={labelClass}>{t.billingInfo} *</label>
              <textarea
                {...register("billingInfo")}
                rows={2}
                className={`${inputClass} resize-none`}
                placeholder={t.billingPlaceholder}
              />
              {errors.billingInfo && (
                <p className="text-red-400 text-xs mt-1.5">{errors.billingInfo.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>{t.notes}</label>
              <textarea
                {...register("notes")}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder={t.notesPlaceholder}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#d4a853] text-black font-semibold tracking-widest text-sm uppercase hover:bg-[#c4963f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
