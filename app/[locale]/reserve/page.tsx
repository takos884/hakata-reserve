"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, type ReservationInput } from "@/lib/validations";
import Link from "next/link";

type Course = {
  id: string;
  nameEn: string;
  nameJa: string;
  nameZhCN: string;
  nameZhTW: string;
  nameKo: string;
  nameTh: string;
  price: number;
};

const timeSlots = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const labels: Record<string, Record<string, string>> = {
  en: {
    title: "Make a Reservation",
    titleJa: "ご予約",
    back: "← Back",
    name: "Full Name",
    email: "Email",
    phone: "Phone (optional)",
    nationality: "Nationality (optional)",
    date: "Visit Date",
    time: "Visit Time",
    partySize: "Party Size",
    course: "Select Course",
    notes: "Allergies / Special Requests",
    next: "Proceed to Confirmation",
    selectTime: "Select a time",
    selectCourse: "Select a course",
    persons: "persons",
    totalLabel: "Total",
  },
  "zh-CN": {
    title: "预约",
    titleJa: "ご予約",
    back: "← 返回",
    name: "姓名",
    email: "电子邮件",
    phone: "电话（选填）",
    nationality: "国籍（选填）",
    date: "到店日期",
    time: "到店时间",
    partySize: "人数",
    course: "选择套餐",
    notes: "过敏/特殊要求",
    next: "确认预约",
    selectTime: "选择时间",
    selectCourse: "选择套餐",
    persons: "人",
    totalLabel: "合计",
  },
  "zh-TW": {
    title: "預約",
    titleJa: "ご予約",
    back: "← 返回",
    name: "姓名",
    email: "電子郵件",
    phone: "電話（選填）",
    nationality: "國籍（選填）",
    date: "到店日期",
    time: "到店時間",
    partySize: "人數",
    course: "選擇套餐",
    notes: "過敏/特殊需求",
    next: "確認預約",
    selectTime: "選擇時間",
    selectCourse: "選擇套餐",
    persons: "人",
    totalLabel: "合計",
  },
  ko: {
    title: "예약하기",
    titleJa: "ご予約",
    back: "← 뒤로",
    name: "이름",
    email: "이메일",
    phone: "전화번호 (선택)",
    nationality: "국적 (선택)",
    date: "방문 날짜",
    time: "방문 시간",
    partySize: "인원수",
    course: "코스 선택",
    notes: "알레르기/특별 요청",
    next: "예약 확인",
    selectTime: "시간 선택",
    selectCourse: "코스 선택",
    persons: "명",
    totalLabel: "합계",
  },
  th: {
    title: "จองที่นั่ง",
    titleJa: "ご予約",
    back: "← กลับ",
    name: "ชื่อ-นามสกุล",
    email: "อีเมล",
    phone: "โทรศัพท์ (ไม่บังคับ)",
    nationality: "สัญชาติ (ไม่บังคับ)",
    date: "วันที่มาร้าน",
    time: "เวลาที่มาร้าน",
    partySize: "จำนวนคน",
    course: "เลือกคอร์ส",
    notes: "อาการแพ้/คำขอพิเศษ",
    next: "ยืนยันการจอง",
    selectTime: "เลือกเวลา",
    selectCourse: "เลือกคอร์ส",
    persons: "คน",
    totalLabel: "รวม",
  },
};

function getCourseName(course: Course, locale: string) {
  const map: Record<string, keyof Course> = {
    en: "nameEn",
    "zh-CN": "nameZhCN",
    "zh-TW": "nameZhTW",
    ko: "nameKo",
    th: "nameTh",
  };
  return (course[map[locale] || "nameEn"] as string) || course.nameEn;
}

const inputClass =
  "w-full bg-[#1c1c1c] border border-[#333] text-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853]/30 placeholder-gray-600 transition-colors";

const labelClass = "block text-xs text-gray-400 tracking-widest uppercase mb-2";

export default function ReservePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const t = labels[locale] || labels.en;

  const [courses, setCourses] = useState<Course[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { lang: locale, partySize: 2 },
  });

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then(setCourses);
  }, []);

  const selectedCourseId = watch("courseId");
  const partySize = watch("partySize");
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const totalAmount = selectedCourse ? selectedCourse.price * (partySize || 1) : 0;

  function onSubmit(data: ReservationInput) {
    sessionStorage.setItem("reservationData", JSON.stringify(data));
    sessionStorage.setItem("totalAmount", String(totalAmount));
    router.push(`/${locale}/reserve/confirm`);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

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
          <h1 className="text-4xl font-light text-gray-100 tracking-widest mb-4">{t.title}</h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#d4a853]/60" />
            <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
            <div className="h-px w-24 bg-[#333]" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Personal Info */}
          <div className="bg-[#111] border border-[#222] p-6 space-y-5">
            <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-3 border-b border-[#222]">
              Personal Information
            </p>

            <div>
              <label className={labelClass}>{t.name} *</label>
              <input
                {...register("name")}
                className={inputClass}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>{t.email} *</label>
              <input
                {...register("email")}
                type="email"
                className={inputClass}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t.phone}</label>
                <input
                  {...register("phone")}
                  className={inputClass}
                  placeholder="+81..."
                />
              </div>
              <div>
                <label className={labelClass}>{t.nationality}</label>
                <input
                  {...register("nationality")}
                  className={inputClass}
                  placeholder="e.g. Japan"
                />
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="bg-[#111] border border-[#222] p-6 space-y-5">
            <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-3 border-b border-[#222]">
              Visit Details
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t.date} *</label>
                <input
                  {...register("visitDate")}
                  type="date"
                  min={minDate}
                  className={inputClass}
                />
                {errors.visitDate && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.visitDate.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>{t.time} *</label>
                <select
                  {...register("visitTime")}
                  className={inputClass}
                >
                  <option value="">{t.selectTime}</option>
                  {timeSlots.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.visitTime && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.visitTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                {t.partySize} * (1–8 {t.persons})
              </label>
              <input
                {...register("partySize", { valueAsNumber: true })}
                type="number"
                min={1}
                max={8}
                className={inputClass}
              />
              {errors.partySize && (
                <p className="text-red-400 text-xs mt-1.5">{errors.partySize.message}</p>
              )}
            </div>
          </div>

          {/* Course Selection */}
          <div className="bg-[#111] border border-[#222] p-6 space-y-4">
            <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-3 border-b border-[#222]">
              {t.course} *
            </p>

            {courses.length === 0 ? (
              <div className="py-6 text-center text-gray-600 text-sm">Loading courses...</div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => {
                  const isSelected = selectedCourseId === course.id;
                  return (
                    <label
                      key={course.id}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#d4a853] bg-[#d4a853]/5"
                          : "border-[#2a2a2a] bg-[#161616] hover:border-[#404040]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-[#d4a853]" : "border-[#444]"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-[#d4a853]" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-light tracking-wider ${isSelected ? "text-gray-100" : "text-gray-300"}`}>
                            {getCourseName(course, locale)}
                          </p>
                          <p className="text-gray-600 text-xs tracking-wider">{course.nameJa}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-base font-light ${isSelected ? "text-[#d4a853]" : "text-gray-400"}`}>
                          ¥{course.price.toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-xs">/ person</p>
                      </div>
                      <input
                        type="radio"
                        value={course.id}
                        className="sr-only"
                        {...register("courseId")}
                      />
                    </label>
                  );
                })}
              </div>
            )}
            {errors.courseId && (
              <p className="text-red-400 text-xs mt-1">{errors.courseId.message}</p>
            )}

            {/* Total Amount */}
            {totalAmount > 0 && (
              <div className="mt-4 p-4 bg-[#d4a853]/10 border border-[#d4a853]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs tracking-widest uppercase">{t.totalLabel}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      ¥{selectedCourse?.price.toLocaleString()} × {partySize} {t.persons}
                    </p>
                  </div>
                  <p className="text-[#d4a853] text-2xl font-light">
                    ¥{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-[#111] border border-[#222] p-6 space-y-5">
            <p className="text-[#d4a853] text-xs tracking-[0.3em] uppercase pb-3 border-b border-[#222]">
              {t.notes}
            </p>
            <textarea
              {...register("notes")}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Allergies, dietary restrictions, special requests..."
            />
          </div>

          <input type="hidden" {...register("lang")} />

          <button
            type="submit"
            className="w-full py-4 bg-[#d4a853] text-black font-semibold tracking-widest text-sm uppercase hover:bg-[#c4963f] transition-colors"
          >
            {t.next}
          </button>
        </form>
      </div>
    </div>
  );
}
