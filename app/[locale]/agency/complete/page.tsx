import Link from "next/link";

export default async function AgencyCompletePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages: Record<string, { title: string; subtitle: string; body: string; note: string; home: string }> = {
    ja: {
      title: "預り金受領完了",
      subtitle: "お問い合わせ受付完了",
      body: "預り金 ¥20,000 のお支払いを確認いたしました。お問い合わせ内容を確認の上、担当者よりご連絡いたします。",
      note: "確認メールをお送りしておりますので、ご確認ください。預り金はご来店時にご利用代金から差し引かれます。",
      home: "ホームに戻る",
    },
    en: {
      title: "Deposit Received",
      subtitle: "Inquiry Submitted",
      body: "Your deposit of ¥20,000 has been received. Our team will review your inquiry and contact you shortly.",
      note: "A confirmation email has been sent. The deposit will be deducted from your final bill on the day of your visit.",
      home: "Return to Home",
    },
    "zh-CN": {
      title: "定金已收到",
      subtitle: "咨询已提交",
      body: "您的 ¥20,000 定金已确认收到。我们的团队将审核您的请求并尽快与您联系。",
      note: "确认邮件已发送，请查收。定金将在您来店当天从消费金额中扣除。",
      home: "返回首页",
    },
    "zh-TW": {
      title: "訂金已收到",
      subtitle: "諮詢已提交",
      body: "您的 ¥20,000 訂金已確認收到。我們的團隊將審核您的請求並儘快與您聯繫。",
      note: "確認郵件已發送，請查收。訂金將在您來店當天從消費金額中扣除。",
      home: "返回首頁",
    },
    ko: {
      title: "보증금 접수 완료",
      subtitle: "문의 접수 완료",
      body: "¥20,000 보증금이 확인되었습니다. 담당 팀이 요청을 검토한 후 연락드리겠습니다.",
      note: "확인 이메일이 발송되었습니다. 보증금은 방문 당일 이용 금액에서 차감됩니다.",
      home: "홈으로 돌아가기",
    },
    th: {
      title: "ได้รับเงินมัดจำแล้ว",
      subtitle: "ส่งคำขอแล้ว",
      body: "ได้รับเงินมัดจำ ¥20,000 ของคุณแล้ว ทีมงานจะตรวจสอบคำขอและติดต่อกลับโดยเร็ว",
      note: "อีเมลยืนยันได้ถูกส่งแล้ว เงินมัดจำจะถูกหักจากยอดรวมในวันที่มาร้าน",
      home: "กลับไปหน้าหลัก",
    },
  };

  const m = messages[locale] || messages.en;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">

        {/* Gold checkmark */}
        <div className="relative mb-10">
          <div className="w-20 h-20 border border-[#d4a853]/40 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-[#d4a853]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">{m.subtitle}</p>
        <h1 className="text-3xl font-light text-gray-100 tracking-widest mb-6">{m.title}</h1>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#d4a853]/40" />
          <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
          <div className="h-px w-8 bg-[#d4a853]/40" />
        </div>

        <div className="bg-[#111] border border-[#222] p-6 mb-8">
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{m.body}</p>
          <p className="text-gray-600 text-xs leading-relaxed">{m.note}</p>
        </div>

        <div className="mb-8 space-y-1">
          <p className="text-[#d4a853]/80 text-sm tracking-wider">博多一瑞亭</p>
          <p className="text-gray-600 text-xs tracking-wider">5-14-1 Shiba, Minato-ku, Tokyo</p>
        </div>

        <Link
          href={`/${locale}`}
          className="inline-block px-10 py-4 border border-[#d4a853]/50 text-[#d4a853] text-sm font-light tracking-widest uppercase hover:bg-[#d4a853]/10 transition-colors"
        >
          {m.home}
        </Link>
      </div>
    </div>
  );
}
