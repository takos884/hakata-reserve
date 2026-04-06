import Link from "next/link";

export default async function CompletePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages: Record<string, { title: string; subtitle: string; body: string; note: string; home: string }> = {
    en: {
      title: "Reservation Confirmed",
      subtitle: "ご予約ありがとうございます",
      body: "Thank you for your reservation at Hakata Issuitei. A confirmation email has been sent to your address with all the details.",
      note: "Please check your email for reservation details and our cancellation policy.",
      home: "Return to Home",
    },
    "zh-CN": {
      title: "预约已确认",
      subtitle: "ご予約ありがとうございます",
      body: "感谢您在博多一瑞亭的预约。确认邮件已发送至您的邮箱，包含所有详细信息。",
      note: "请查看您的邮件以获取预约详情和取消政策。",
      home: "返回首页",
    },
    "zh-TW": {
      title: "預約已確認",
      subtitle: "ご予約ありがとうございます",
      body: "感謝您在博多一瑞亭的預約。確認郵件已發送至您的郵箱，包含所有詳細資訊。",
      note: "請查看您的郵件以獲取預約詳情和取消政策。",
      home: "返回首頁",
    },
    ko: {
      title: "예약이 확정되었습니다",
      subtitle: "ご予約ありがとうございます",
      body: "하카타 잇스이테이를 예약해 주셔서 감사합니다. 모든 세부 정보가 담긴 확인 이메일이 발송되었습니다.",
      note: "예약 세부 정보 및 취소 정책은 이메일을 확인해 주세요.",
      home: "홈으로 돌아가기",
    },
    th: {
      title: "ยืนยันการจองแล้ว",
      subtitle: "ご予約ありがとうございます",
      body: "ขอบคุณสำหรับการจองที่ฮากาตะ อิสซุยเต อีเมลยืนยันพร้อมรายละเอียดทั้งหมดได้ถูกส่งไปยังที่อยู่อีเมลของคุณแล้ว",
      note: "โปรดตรวจสอบอีเมลของคุณสำหรับรายละเอียดการจองและนโยบายการยกเลิก",
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
          {/* Corner decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-2">
            <div className="w-px h-6 bg-gradient-to-t from-[#d4a853]/40 to-transparent mx-auto" />
          </div>
        </div>

        {/* Title */}
        <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">{m.subtitle}</p>
        <h1 className="text-3xl font-light text-gray-100 tracking-widest mb-6">{m.title}</h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#d4a853]/40" />
          <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
          <div className="h-px w-8 bg-[#d4a853]/40" />
        </div>

        {/* Body text */}
        <div className="bg-[#111] border border-[#222] p-6 mb-8">
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{m.body}</p>
          <p className="text-gray-600 text-xs leading-relaxed">{m.note}</p>
        </div>

        {/* Restaurant info reminder */}
        <div className="mb-8 space-y-1">
          <p className="text-[#d4a853]/80 text-sm tracking-wider">博多一瑞亭</p>
          <p className="text-gray-600 text-xs tracking-wider">Mita, Minato-ku, Tokyo</p>
          <p className="text-gray-600 text-xs tracking-wider">Lunch 11:00–14:00 · Dinner 17:00–21:00</p>
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
