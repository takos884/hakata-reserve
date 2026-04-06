import Link from "next/link";
import Image from "next/image";

const content: Record<string, {
  hero: string;
  heroJa: string;
  tagline: string;
  subtitle: string;
  individual: string;
  individualDesc: string;
  agency: string;
  agencyDesc: string;
  address: string;
  hours: string;
  storyTitle: string;
  storyText: string;
  menuTitle: string;
  menuSubtitle: string;
  reserveNow: string;
  inquire: string;
}> = {
  en: {
    hero: "Hakata Issuitei",
    heroJa: "博多一瑞亭",
    tagline: "珠玉の一杯",
    subtitle: "Authentic Hakata Tonkotsu Ramen — Mita, Tokyo",
    individual: "Individual / Group",
    individualDesc: "1–8 guests. Reserve online with secure payment.",
    agency: "Travel Agency",
    agencyDesc: "Groups of 9+. Submit an inquiry for a payment link.",
    address: "Mita, Minato-ku, Tokyo",
    hours: "Lunch 11:00–14:00 · Dinner 17:00–21:00",
    storyTitle: "STORY",
    storyText: "Born in Hakata, Fukuoka — the birthplace of tonkotsu ramen — Issuitei has carried the soul of the original bowl to the heart of Tokyo's Mita district. Our broth simmers for over 18 hours, yielding a rich, creamy depth that no shortcut can replicate. Every visit is an encounter with a gem of a bowl.",
    menuTitle: "COURSES",
    menuSubtitle: "Select your experience",
    reserveNow: "Reserve a Table",
    inquire: "Submit Inquiry",
  },
  "zh-CN": {
    hero: "博多一瑞亭",
    heroJa: "博多一瑞亭",
    tagline: "珠玉の一杯",
    subtitle: "东京三田 · 正宗博多豚骨拉面",
    individual: "个人 / 团体预约",
    individualDesc: "1–8位客人，在线支付确认预约。",
    agency: "旅行社咨询",
    agencyDesc: "9人以上团体，提交咨询后发送付款链接。",
    address: "东京都港区三田",
    hours: "午餐 11:00–14:00 · 晚餐 17:00–21:00",
    storyTitle: "故事",
    storyText: "一瑞亭诞生于豚骨拉面的发源地——福冈博多，如今将这份灵魂之味带到了东京三田。我们的汤底需熬制18小时以上，浓醇醇厚，每一碗都是珠玉般的享受。",
    menuTitle: "套餐",
    menuSubtitle: "选择您的用餐体验",
    reserveNow: "立即预约",
    inquire: "提交咨询",
  },
  "zh-TW": {
    hero: "博多一瑞亭",
    heroJa: "博多一瑞亭",
    tagline: "珠玉の一杯",
    subtitle: "東京三田 · 正宗博多豚骨拉麵",
    individual: "個人 / 團體預約",
    individualDesc: "1–8位客人，線上付款確認預約。",
    agency: "旅行社諮詢",
    agencyDesc: "9人以上團體，提交諮詢後發送付款連結。",
    address: "東京都港區三田",
    hours: "午餐 11:00–14:00 · 晚餐 17:00–21:00",
    storyTitle: "故事",
    storyText: "一瑞亭誕生於豚骨拉麵的發源地——福岡博多，如今將這份靈魂之味帶到了東京三田。我們的湯底需熬製18小時以上，濃醇醇厚，每一碗都是珠玉般的享受。",
    menuTitle: "套餐",
    menuSubtitle: "選擇您的用餐體驗",
    reserveNow: "立即預約",
    inquire: "提交諮詢",
  },
  ko: {
    hero: "하카타 잇스이테이",
    heroJa: "博多一瑞亭",
    tagline: "珠玉の一杯",
    subtitle: "도쿄 미타 · 정통 하카타 돈코츠 라멘",
    individual: "개인 / 그룹 예약",
    individualDesc: "1–8명. 온라인 결제로 예약을 확정하세요.",
    agency: "여행사 문의",
    agencyDesc: "9명 이상 단체. 문의하시면 결제 링크를 보내드립니다.",
    address: "도쿄도 미나토구 미타",
    hours: "런치 11:00–14:00 · 디너 17:00–21:00",
    storyTitle: "스토리",
    storyText: "돈코츠 라멘의 발상지 후쿠오카 하카타에서 탄생한 잇스이테이가, 도쿄 미타의 중심부에 그 정신을 이어오고 있습니다. 18시간 이상 끓인 육수는 깊고 진한 풍미를 자랑하며, 한 그릇 한 그릇이 보석과 같은 경험입니다.",
    menuTitle: "코스",
    menuSubtitle: "식사 경험을 선택하세요",
    reserveNow: "예약하기",
    inquire: "문의하기",
  },
  th: {
    hero: "ฮากาตะ อิสซุยเต",
    heroJa: "博多一瑞亭",
    tagline: "珠玉の一杯",
    subtitle: "ราเมนทงคตสึฮากาตะแท้ๆ ที่มิตะ โตเกียว",
    individual: "จองสำหรับบุคคล / กลุ่ม",
    individualDesc: "1–8 ท่าน ยืนยันการจองด้วยการชำระเงินออนไลน์",
    agency: "สอบถามสำหรับบริษัททัวร์",
    agencyDesc: "กลุ่ม 9 คนขึ้นไป ส่งคำขอแล้วเราจะส่งลิงก์ชำระเงินให้",
    address: "มิตะ มินาโตะ โตเกียว",
    hours: "กลางวัน 11:00–14:00 · เย็น 17:00–21:00",
    storyTitle: "เรื่องราว",
    storyText: "อิสซุยเตกำเนิดในฮากาตะ ฟุกุโอกะ บ้านเกิดของราเมนทงคตสึ และนำจิตวิญญาณของชามต้นตำรับมาสู่ย่านมิตะในโตเกียว น้ำซุปเคี่ยวกว่า 18 ชั่วโมง ให้ความเข้มข้นที่ไม่มีสูตรลัดใดเทียบได้",
    menuTitle: "คอร์ส",
    menuSubtitle: "เลือกประสบการณ์ของคุณ",
    reserveNow: "จองโต๊ะ",
    inquire: "ส่งคำขอ",
  },
};

const locales = [
  { code: "en", label: "EN" },
  { code: "zh-CN", label: "简体" },
  { code: "zh-TW", label: "繁體" },
  { code: "ko", label: "한국어" },
  { code: "th", label: "ไทย" },
];

const courses = [
  { nameEn: "Hakata Tonkotsu Ramen", nameJa: "博多豚骨ラーメン", price: "¥1,200", image: "/images/menu-img06.jpg" },
  { nameEn: "Special Tonkotsu Ramen", nameJa: "特製豚骨ラーメン", price: "¥1,500", image: "/images/menu-img07.jpg" },
  { nameEn: "Ramen + Extra Noodles Set", nameJa: "替え玉セット", price: "¥1,600", image: "/images/menu-img18.jpg" },
  { nameEn: "Chef's Course", nameJa: "おまかせコース", price: "¥3,000", image: "/images/menu-img08.jpg" },
];

const menuGallery = [
  { src: "/images/menu-img01.jpg", alt: "Gyoza" },
  { src: "/images/menu-img02.jpg", alt: "Side dish" },
  { src: "/images/menu-img03.jpg", alt: "Fried rice" },
  { src: "/images/menu-img04.jpg", alt: "Appetizer" },
  { src: "/images/menu-img05.jpg", alt: "Special" },
  { src: "/images/menu-img09.jpg", alt: "Drink" },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = content[locale] || content.en;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">

      {/* Language Switcher */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-[#d4a853] tracking-widest font-light">
            博多一瑞亭
          </span>
          <div className="flex gap-1">
            {locales.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                className={`px-3 py-1 text-xs tracking-wider rounded transition-all ${
                  locale === l.code
                    ? "text-[#d4a853] border border-[#d4a853]/50 bg-[#d4a853]/10"
                    : "text-gray-400 hover:text-gray-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section — Full-screen with background image */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/nav-img.jpg"
          alt="Hakata Issuitei Ramen"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        {/* Radial gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.08)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Decorative lines */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4a853]" />
            <span className="text-[#d4a853] text-xs tracking-[0.4em] uppercase">Est. Hakata, Fukuoka</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4a853]" />
          </div>

          <p className="text-[#d4a853]/70 text-2xl tracking-[0.3em] mb-2 font-light">
            {t.heroJa}
          </p>

          <h1 className="text-5xl md:text-7xl font-light tracking-widest text-white mb-4 leading-tight drop-shadow-lg">
            {t.hero}
          </h1>

          <p className="text-[#d4a853] text-3xl md:text-4xl font-light tracking-[0.2em] mb-6 drop-shadow-md">
            {t.tagline}
          </p>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#d4a853]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]/60" />
            <div className="h-px w-12 bg-[#d4a853]/40" />
          </div>

          <p className="text-gray-300 text-lg tracking-wider font-light mb-12">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/reserve`}
              className="px-10 py-4 bg-[#d4a853] text-black font-semibold tracking-widest text-sm uppercase hover:bg-[#c4963f] transition-colors"
            >
              {t.reserveNow}
            </Link>
            <Link
              href={`/${locale}/agency`}
              className="px-10 py-4 border border-[#d4a853]/50 text-[#d4a853] font-light tracking-widest text-sm uppercase hover:bg-[#d4a853]/10 transition-colors backdrop-blur-sm"
            >
              {t.inquire}
            </Link>
          </div>

          <div className="mt-20 flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs tracking-[0.3em]">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent" />
          </div>
        </div>
      </section>

      {/* Featured Ramen Image Section */}
      <section className="relative py-0 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
          <div className="relative aspect-[16/7] overflow-hidden border border-[#333]">
            <Image
              src="/images/home-img02.png"
              alt="Signature Tonkotsu Ramen"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-1">Signature</p>
              <p className="text-white text-2xl font-light tracking-widest">博多豚骨ラーメン</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Cards */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">RESERVATION</p>
            <h2 className="text-3xl font-light text-gray-100 tracking-widest">ご予約</h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[#d4a853]/40" />
              <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
              <div className="h-px w-8 bg-[#d4a853]/40" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Individual Card */}
            <Link
              href={`/${locale}/reserve`}
              className="group relative block overflow-hidden bg-[#141414] border border-[#333] hover:border-[#d4a853]/60 transition-all duration-300"
            >
              {/* Card image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/menu-img10.jpg"
                  alt="Individual reservation"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
              </div>
              <div className="p-8 -mt-8 relative">
                <div className="w-12 h-12 border border-[#d4a853]/40 flex items-center justify-center mb-5 bg-[#141414] group-hover:border-[#d4a853] transition-colors">
                  <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-light text-gray-100 tracking-wider mb-3">{t.individual}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{t.individualDesc}</p>
                <div className="flex items-center gap-2 text-[#d4a853] text-xs tracking-widest">
                  <span>RESERVE</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Agency Card */}
            <Link
              href={`/${locale}/agency`}
              className="group relative block overflow-hidden bg-[#141414] border border-[#333] hover:border-[#d4a853]/60 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/menu-img11.jpg"
                  alt="Agency reservation"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
              </div>
              <div className="p-8 -mt-8 relative">
                <div className="w-12 h-12 border border-[#d4a853]/40 flex items-center justify-center mb-5 bg-[#141414] group-hover:border-[#d4a853] transition-colors">
                  <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl font-light text-gray-100 tracking-wider mb-3">{t.agency}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{t.agencyDesc}</p>
                <div className="flex items-center gap-2 text-[#d4a853] text-xs tracking-widest">
                  <span>INQUIRE</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section with image */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">{t.storyTitle}</p>
            <h2 className="text-3xl font-light text-gray-100 tracking-widest mb-4">博多の魂</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[#d4a853]/40" />
              <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
              <div className="h-px w-8 bg-[#d4a853]/40" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Story image */}
            <div className="relative aspect-[4/5] overflow-hidden border border-[#333]">
              <Image
                src="/images/menu-img06.jpg"
                alt="Tonkotsu Ramen"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
              {/* Steam overlay */}
              <div className="absolute top-0 left-0 right-0 h-1/3 opacity-40">
                <Image
                  src="/images/steam01.png"
                  alt=""
                  fill
                  className="object-cover mix-blend-screen"
                />
              </div>
            </div>

            {/* Story text */}
            <div>
              <p className="text-gray-400 text-base leading-loose font-light mb-10">
                {t.storyText}
              </p>

              <div className="grid grid-cols-3 gap-6 border-t border-[#222] pt-10">
                <div className="text-center">
                  <p className="text-[#d4a853] text-3xl font-light mb-2">18+</p>
                  <p className="text-gray-600 text-xs tracking-widest uppercase">Hours Simmered</p>
                </div>
                <div className="text-center">
                  <p className="text-[#d4a853] text-3xl font-light mb-2">8</p>
                  <p className="text-gray-600 text-xs tracking-widest uppercase">Max Guests</p>
                </div>
                <div className="text-center">
                  <p className="text-[#d4a853] text-3xl font-light mb-2">4</p>
                  <p className="text-gray-600 text-xs tracking-widest uppercase">Course Options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu / Courses Section with images */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">{t.menuTitle}</p>
            <h2 className="text-3xl font-light text-gray-100 tracking-widest mb-4">MENU</h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#d4a853]/40" />
              <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
              <div className="h-px w-8 bg-[#d4a853]/40" />
            </div>
            <p className="text-gray-500 text-sm tracking-wider">{t.menuSubtitle}</p>
          </div>

          {/* Course cards with images */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {courses.map((course, i) => (
              <div
                key={i}
                className="group relative overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#d4a853]/30 transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.nameEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-[#d4a853]/40 px-4 py-2">
                    <p className="text-[#d4a853] text-lg font-light">{course.price}</p>
                    <p className="text-gray-500 text-xs text-center">/ person</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-200 text-lg font-light tracking-wider mb-1">{course.nameEn}</p>
                  <p className="text-gray-600 text-sm tracking-wider">{course.nameJa}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Side menu gallery */}
          <div className="mb-10">
            <p className="text-center text-gray-600 text-xs tracking-[0.3em] uppercase mb-6">Side Menu & Drinks</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {menuGallery.map((item, i) => (
                <div key={i} className="relative aspect-square overflow-hidden border border-[#222] hover:border-[#d4a853]/30 transition-colors">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/reserve`}
              className="inline-block px-10 py-4 bg-[#d4a853] text-black font-semibold tracking-widest text-sm uppercase hover:bg-[#c4963f] transition-colors"
            >
              {t.reserveNow}
            </Link>
          </div>
        </div>
      </section>

      {/* Takeout Section */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden border border-[#333]">
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/take-out-menu.jpg"
                alt="Take Out Menu"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-10">
                  <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">TAKE OUT</p>
                  <h3 className="text-3xl font-light text-white tracking-widest mb-3">お持ち帰り</h3>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                    Enjoy our authentic Hakata tonkotsu ramen at home. Available for takeout during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">ACCESS</p>
          <h2 className="text-3xl font-light text-gray-100 tracking-widest mb-4">STORE</h2>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-8 bg-[#d4a853]/40" />
            <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
            <div className="h-px w-8 bg-[#d4a853]/40" />
          </div>
          <p className="text-gray-300 text-lg tracking-wider mb-2">博多一瑞亭</p>
          <p className="text-gray-500 text-sm tracking-wider mb-1">{t.address}</p>
          <p className="text-gray-500 text-sm tracking-wider mb-8">{t.hours}</p>

          {/* Google Map embed placeholder */}
          <div className="relative aspect-[16/9] bg-[#141414] border border-[#333] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3242.5!2d139.7434!3d35.6484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM4JzU0LjIiTiAxMznCsDQ0JzM2LjIiRQ!5e0!3m2!1sen!2sjp!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] py-10 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[#d4a853] text-sm tracking-widest mb-1">博多一瑞亭</p>
            <p className="text-gray-600 text-xs tracking-wider">Hakata Issuitei · {t.address}</p>
          </div>
          <div className="flex gap-6">
            {locales.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                className={`text-xs tracking-wider transition-colors ${
                  locale === l.code ? "text-[#d4a853]" : "text-gray-600 hover:text-gray-400"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-gray-700 text-xs">&copy; 2026 Hakata Issuitei</p>
        </div>
      </footer>
    </div>
  );
}
