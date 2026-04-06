"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

type FAQ = {
  question: string;
  answer: string;
};

const chatData: Record<string, {
  title: string;
  subtitle: string;
  placeholder: string;
  greeting: string;
  faqLabel: string;
  noMatch: string;
  faqs: FAQ[];
}> = {
  en: {
    title: "Hakata Issuitei",
    subtitle: "Chat Support",
    placeholder: "Type your question...",
    greeting: "Welcome to Hakata Issuitei! How can I help you today? You can ask about reservations, menu, access, or select a question below.",
    faqLabel: "Frequently Asked Questions",
    noMatch: "Thank you for your message. For detailed inquiries, please email us at issuitei000@gmail.com or call during business hours. You can also make a reservation directly from our website.",
    faqs: [
      {
        question: "How do I make a reservation?",
        answer: "You can reserve online through our website. For individuals/groups (1-8 guests), use the reservation form with online payment. For groups of 9+, please use the travel agency inquiry form and we'll send you a payment link.",
      },
      {
        question: "What are your business hours?",
        answer: "Lunch: 11:00–14:00 (Last order 13:30)\nDinner: 17:00–21:00 (Last order 20:30)\nWe are closed on national holidays. Please check our website for the latest schedule.",
      },
      {
        question: "Where is the restaurant located?",
        answer: "We are located in Mita, Minato-ku, Tokyo. The nearest station is Mita Station (Toei Mita Line / Toei Asakusa Line). About a 3-minute walk from Exit A3.",
      },
      {
        question: "What's on the menu?",
        answer: "Our specialty is authentic Hakata Tonkotsu Ramen, simmered for over 18 hours. We offer:\n• Hakata Tonkotsu Ramen — ¥1,200\n• Special Tonkotsu Ramen — ¥1,500\n• Ramen + Extra Noodles Set — ¥1,600\n• Chef's Course — ¥3,000\nSide dishes, gyoza, and drinks are also available.",
      },
      {
        question: "Do you accommodate allergies?",
        answer: "Yes, please note any allergies or dietary requirements in the reservation form. Our ramen contains pork, wheat, soy, and eggs. We'll do our best to accommodate your needs.",
      },
      {
        question: "What is the cancellation policy?",
        answer: "• 8+ days before: Free cancellation\n• 3-7 days before: 30% fee\n• 1-2 days before: 50% fee\n• Same day / No-show: 100% fee\nRefunds are processed through Stripe.",
      },
      {
        question: "Is takeout available?",
        answer: "Yes! We offer takeout during regular business hours. Please visit the restaurant directly to order takeout.",
      },
      {
        question: "Do you accept credit cards?",
        answer: "Yes, we accept all major credit cards (Visa, Mastercard, Amex, JCB) for both dine-in and online reservation payments through Stripe.",
      },
    ],
  },
  "zh-CN": {
    title: "博多一瑞亭",
    subtitle: "在线客服",
    placeholder: "请输入您的问题...",
    greeting: "欢迎来到博多一瑞亭！请问有什么可以帮您的吗？您可以咨询预约、菜单、交通等问题，或选择以下常见问题。",
    faqLabel: "常见问题",
    noMatch: "感谢您的留言。如需详细咨询，请发送邮件至 issuitei000@gmail.com 或在营业时间致电。您也可以直接通过网站预约。",
    faqs: [
      {
        question: "如何预约？",
        answer: "您可以通过我们的网站在线预约。个人/团体（1-8位）可使用在线支付预约表单。9人以上团体请使用旅行社咨询表单，我们会发送付款链接给您。",
      },
      {
        question: "营业时间是？",
        answer: "午餐：11:00–14:00（最后点餐 13:30）\n晚餐：17:00–21:00（最后点餐 20:30）\n国定假日休息，请查看网站了解最新安排。",
      },
      {
        question: "餐厅在哪里？",
        answer: "我们位于东京都港区三田。最近车站为三田站（都营三田线/都营浅草线），从A3出口步行约3分钟。",
      },
      {
        question: "有什么菜品？",
        answer: "我们的招牌是正宗博多豚骨拉面，汤底熬制超过18小时。\n• 博多豚骨拉面 — ¥1,200\n• 特制豚骨拉面 — ¥1,500\n• 拉面+加面套餐 — ¥1,600\n• 主厨推荐套餐 — ¥3,000\n还有小菜、饺子和饮品。",
      },
      {
        question: "可以处理过敏需求吗？",
        answer: "可以的，请在预约表单中注明过敏或饮食要求。我们的拉面含有猪肉、小麦、大豆和鸡蛋成分。我们会尽力满足您的需求。",
      },
      {
        question: "取消政策是什么？",
        answer: "• 8天以上：免费取消\n• 3-7天前：收取30%费用\n• 1-2天前：收取50%费用\n• 当天/未到：收取100%费用\n退款通过Stripe处理。",
      },
    ],
  },
  "zh-TW": {
    title: "博多一瑞亭",
    subtitle: "線上客服",
    placeholder: "請輸入您的問題...",
    greeting: "歡迎來到博多一瑞亭！請問有什麼可以幫您的嗎？您可以諮詢預約、菜單、交通等問題，或選擇以下常見問題。",
    faqLabel: "常見問題",
    noMatch: "感謝您的留言。如需詳細諮詢，請發送郵件至 issuitei000@gmail.com 或在營業時間致電。您也可以直接通過網站預約。",
    faqs: [
      {
        question: "如何預約？",
        answer: "您可以透過我們的網站線上預約。個人/團體（1-8位）可使用線上付款預約表單。9人以上團體請使用旅行社諮詢表單，我們會發送付款連結給您。",
      },
      {
        question: "營業時間是？",
        answer: "午餐：11:00–14:00（最後點餐 13:30）\n晚餐：17:00–21:00（最後點餐 20:30）\n國定假日休息，請查看網站了解最新安排。",
      },
      {
        question: "餐廳在哪裡？",
        answer: "我們位於東京都港區三田。最近車站為三田站（都營三田線/都營淺草線），從A3出口步行約3分鐘。",
      },
      {
        question: "有什麼菜品？",
        answer: "我們的招牌是正宗博多豚骨拉麵，湯底熬製超過18小時。\n• 博多豚骨拉麵 — ¥1,200\n• 特製豚骨拉麵 — ¥1,500\n• 拉麵+加麵套餐 — ¥1,600\n• 主廚推薦套餐 — ¥3,000\n還有小菜、餃子和飲品。",
      },
      {
        question: "取消政策是什麼？",
        answer: "• 8天以上：免費取消\n• 3-7天前：收取30%費用\n• 1-2天前：收取50%費用\n• 當天/未到：收取100%費用\n退款透過Stripe處理。",
      },
    ],
  },
  ko: {
    title: "하카타 잇스이테이",
    subtitle: "채팅 지원",
    placeholder: "질문을 입력하세요...",
    greeting: "하카타 잇스이테이에 오신 것을 환영합니다! 무엇을 도와드릴까요? 예약, 메뉴, 오시는 길 등을 문의하시거나 아래 질문을 선택해 주세요.",
    faqLabel: "자주 묻는 질문",
    noMatch: "문의해 주셔서 감사합니다. 자세한 문의는 issuitei000@gmail.com으로 이메일을 보내시거나 영업시간에 전화해 주세요. 웹사이트에서 직접 예약하실 수도 있습니다.",
    faqs: [
      {
        question: "어떻게 예약하나요?",
        answer: "웹사이트에서 온라인으로 예약하실 수 있습니다. 개인/그룹(1-8명)은 온라인 결제 예약 양식을 이용하세요. 9명 이상 단체는 여행사 문의 양식을 이용하시면 결제 링크를 보내드립니다.",
      },
      {
        question: "영업시간은?",
        answer: "런치: 11:00–14:00 (라스트오더 13:30)\n디너: 17:00–21:00 (라스트오더 20:30)\n공휴일 휴무. 최신 일정은 웹사이트를 확인해 주세요.",
      },
      {
        question: "레스토랑 위치는?",
        answer: "도쿄도 미나토구 미타에 위치해 있습니다. 가장 가까운 역은 미타역(도에이 미타선/도에이 아사쿠사선)이며 A3 출구에서 도보 약 3분입니다.",
      },
      {
        question: "메뉴는 어떤 것이 있나요?",
        answer: "18시간 이상 끓인 정통 하카타 돈코츠 라멘이 대표 메뉴입니다.\n• 하카타 돈코츠 라멘 — ¥1,200\n• 특제 돈코츠 라멘 — ¥1,500\n• 라멘 + 추가 면 세트 — ¥1,600\n• 셰프 코스 — ¥3,000\n사이드 메뉴, 교자, 음료도 있습니다.",
      },
      {
        question: "취소 정책은?",
        answer: "• 8일 이상 전: 무료 취소\n• 3-7일 전: 30% 수수료\n• 1-2일 전: 50% 수수료\n• 당일/노쇼: 100% 수수료\n환불은 Stripe를 통해 처리됩니다.",
      },
    ],
  },
  th: {
    title: "ฮากาตะ อิสซุยเต",
    subtitle: "แชทสนับสนุน",
    placeholder: "พิมพ์คำถามของคุณ...",
    greeting: "ยินดีต้อนรับสู่ฮากาตะ อิสซุยเต! มีอะไรให้ช่วยไหมคะ? สามารถสอบถามเกี่ยวกับการจอง เมนู การเดินทาง หรือเลือกคำถามด้านล่าง",
    faqLabel: "คำถามที่พบบ่อย",
    noMatch: "ขอบคุณสำหรับข้อความ สำหรับรายละเอียดเพิ่มเติม กรุณาส่งอีเมลมาที่ issuitei000@gmail.com หรือโทรในเวลาทำการ คุณสามารถจองโดยตรงจากเว็บไซต์ได้",
    faqs: [
      {
        question: "จองอย่างไร?",
        answer: "คุณสามารถจองออนไลน์ผ่านเว็บไซต์ สำหรับบุคคล/กลุ่ม (1-8 ท่าน) ใช้แบบฟอร์มจองพร้อมชำระเงินออนไลน์ กลุ่ม 9 คนขึ้นไป กรุณาใช้แบบฟอร์มสอบถามสำหรับบริษัททัวร์ เราจะส่งลิงก์ชำระเงินให้",
      },
      {
        question: "เวลาเปิดทำการ?",
        answer: "กลางวัน: 11:00–14:00 (ออเดอร์สุดท้าย 13:30)\nเย็น: 17:00–21:00 (ออเดอร์สุดท้าย 20:30)\nปิดวันหยุดนักขัตฤกษ์ กรุณาตรวจสอบเว็บไซต์",
      },
      {
        question: "ร้านอยู่ที่ไหน?",
        answer: "ตั้งอยู่ที่มิตะ มินาโตะ โตเกียว สถานีที่ใกล้ที่สุดคือสถานีมิตะ (สาย Toei Mita/Toei Asakusa) เดินจากทางออก A3 ประมาณ 3 นาที",
      },
      {
        question: "มีเมนูอะไรบ้าง?",
        answer: "เมนูเด่นคือราเมนทงคตสึฮากาตะแท้ๆ ต้มนานกว่า 18 ชั่วโมง\n• ราเมนทงคตสึฮากาตะ — ¥1,200\n• ราเมนทงคตสึพิเศษ — ¥1,500\n• ราเมน + เส้นเพิ่มเซ็ต — ¥1,600\n• คอร์สเชฟแนะนำ — ¥3,000\nมีเมนูข้างเคียง เกี๊ยวซ่า และเครื่องดื่มด้วย",
      },
      {
        question: "นโยบายการยกเลิก?",
        answer: "• 8 วันขึ้นไป: ยกเลิกฟรี\n• 3-7 วันก่อน: ค่าธรรมเนียม 30%\n• 1-2 วันก่อน: ค่าธรรมเนียม 50%\n• วันเดียวกัน/ไม่มา: ค่าธรรมเนียม 100%\nคืนเงินผ่าน Stripe",
      },
    ],
  },
};

// Simple keyword matching for free-text input
function findAnswer(input: string, faqs: FAQ[], noMatch: string): string {
  const lower = input.toLowerCase();
  const keywords: Record<string, string[]> = {
    reservation: ["reserv", "book", "予約", "预约", "預約", "예약", "จอง", "how to", "make"],
    hours: ["hour", "time", "open", "close", "営業", "时间", "時間", "시간", "เวลา", "lunch", "dinner"],
    location: ["where", "location", "access", "address", "station", "direction", "場所", "地址", "位置", "위치", "ที่ไหน", "map"],
    menu: ["menu", "course", "ramen", "food", "price", "メニュー", "菜", "套餐", "메뉴", "라멘", "เมนู", "ราเมน"],
    allergy: ["allerg", "diet", "vegetar", "vegan", "halal", "アレルギー", "过敏", "過敏", "알레르기", "แพ้"],
    cancel: ["cancel", "refund", "policy", "キャンセル", "取消", "취소", "ยกเลิก"],
    takeout: ["takeout", "take out", "take-out", "持ち帰り", "外带", "外帶", "포장", "กลับบ้าน"],
    payment: ["pay", "card", "credit", "visa", "stripe", "支払", "支付", "付款", "결제", "ชำระ"],
  };

  const faqIndex: Record<string, number> = {
    reservation: 0,
    hours: 1,
    location: 2,
    menu: 3,
    allergy: 4,
    cancel: 5,
    takeout: 6,
    payment: 7,
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      const idx = faqIndex[category];
      if (idx !== undefined && faqs[idx]) {
        return faqs[idx].answer;
      }
    }
  }

  return noMatch;
}

export function ChatWidget({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const t = chatData[locale] || chatData.en;

  useEffect(() => {
    if (open && !initialized) {
      setMessages([{ id: 0, role: "bot", text: t.greeting }]);
      setInitialized(true);
    }
  }, [open, initialized, t.greeting]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleFAQ(faq: FAQ) {
    const userMsg: Message = { id: Date.now(), role: "user", text: faq.question };
    const botMsg: Message = { id: Date.now() + 1, role: "bot", text: faq.answer };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  }

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: input };
    const answer = findAnswer(input, t.faqs, t.noMatch);
    const botMsg: Message = { id: Date.now() + 1, role: "bot", text: answer };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#d4a853] hover:bg-[#c4963f] text-black rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Unread badge when closed */}
      {!open && !initialized && (
        <span className="fixed bottom-[4.5rem] right-6 z-50 px-3 py-1.5 bg-[#0a0a0a] border border-[#d4a853]/40 text-[#d4a853] text-xs rounded-lg shadow-lg animate-bounce pointer-events-none">
          {locale === "en" ? "Need help?" : locale === "ko" ? "도움이 필요하세요?" : locale === "th" ? "ต้องการความช่วยเหลือ?" : "需要帮助？"}
        </span>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#111] border-b border-[#222] px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4a853]/20 border border-[#d4a853]/40 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#d4a853] text-sm font-light">瑞</span>
            </div>
            <div>
              <p className="text-gray-100 text-sm font-medium tracking-wider">{t.title}</p>
              <p className="text-gray-500 text-xs tracking-wider">{t.subtitle}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px] min-h-[200px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-[#d4a853] text-black rounded-2xl rounded-br-sm"
                      : "bg-[#1c1c1c] text-gray-300 border border-[#333] rounded-2xl rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* FAQ Buttons — show after greeting */}
            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="text-gray-600 text-xs tracking-wider uppercase">{t.faqLabel}</p>
                {t.faqs.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => handleFAQ(faq)}
                    className="block w-full text-left px-3 py-2 bg-[#141414] border border-[#333] text-gray-300 text-xs rounded-lg hover:border-[#d4a853]/50 hover:text-[#d4a853] transition-colors"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick FAQ re-show button */}
          {messages.length > 1 && (
            <div className="px-4 pb-2">
              <button
                onClick={() => {
                  setMessages([{ id: 0, role: "bot", text: t.greeting }]);
                }}
                className="text-xs text-gray-600 hover:text-[#d4a853] transition-colors"
              >
                ← {t.faqLabel}
              </button>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[#222] p-3 bg-[#111]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 bg-[#1c1c1c] border border-[#333] text-gray-100 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:border-[#d4a853] placeholder-gray-600"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-[#d4a853] hover:bg-[#c4963f] rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
