type ReservationData = {
  name: string;
  visitDate: string;
  visitTime: string;
  partySize: number;
  courseName: string;
  amountPaid: number;
  reservationId: string;
};

const translations: Record<string, {
  confirmSubject: string;
  confirmTitle: string;
  confirmGreeting: (name: string) => string;
  confirmBody: string;
  date: string;
  time: string;
  partySize: string;
  course: string;
  amount: string;
  closing: string;
  reminderSubject: string;
  reminderTitle: string;
  reminderBody: (name: string) => string;
  cancelSubject: string;
  cancelTitle: string;
  cancelBody: (name: string) => string;
}> = {
  ja: {
    confirmSubject: "ご予約確認 - 博多一瑞亭",
    confirmTitle: "ご予約が確定しました！",
    confirmGreeting: (name) => `${name} 様`,
    confirmBody: "ご予約の詳細は以下の通りです：",
    date: "日付",
    time: "時間",
    partySize: "人数",
    course: "コース",
    amount: "お支払い金額",
    closing: "ご来店を心よりお待ちしております。\n\n博多一瑞亭\n東京都港区芝5丁目14-1",
    reminderSubject: "リマインダー：博多一瑞亭のご予約",
    reminderTitle: "ご予約のリマインダー",
    reminderBody: (name) => `${name} 様、ご予約日の2日前となりましたのでお知らせいたします。`,
    cancelSubject: "ご予約キャンセル - 博多一瑞亭",
    cancelTitle: "ご予約のキャンセル",
    cancelBody: (name) => `${name} 様、ご予約がキャンセルされました。`,
  },
  en: {
    confirmSubject: "Reservation Confirmed - Hakata Issuitei",
    confirmTitle: "Your reservation is confirmed!",
    confirmGreeting: (name) => `Dear ${name},`,
    confirmBody: "Here are your reservation details:",
    date: "Date",
    time: "Time",
    partySize: "Party Size",
    course: "Course",
    amount: "Amount Paid",
    closing: "We look forward to seeing you!\n\nHakata Issuitei\n5-14-1 Shiba, Minato-ku, Tokyo",
    reminderSubject: "Reminder: Your reservation at Hakata Issuitei",
    reminderTitle: "Reservation Reminder",
    reminderBody: (name) => `Dear ${name}, this is a reminder that your reservation is coming up in 2 days.`,
    cancelSubject: "Reservation Cancelled - Hakata Issuitei",
    cancelTitle: "Reservation Cancelled",
    cancelBody: (name) => `Dear ${name}, your reservation has been cancelled.`,
  },
  "zh-CN": {
    confirmSubject: "预约确认 - 博多一瑞亭",
    confirmTitle: "您的预约已确认！",
    confirmGreeting: (name) => `${name} 您好，`,
    confirmBody: "以下是您的预约详情：",
    date: "日期",
    time: "时间",
    partySize: "人数",
    course: "套餐",
    amount: "已付金额",
    closing: "期待您的光临！\n\n博多一瑞亭\n东京都港区芝5丁目14-1",
    reminderSubject: "提醒：您在博多一瑞亭的预约",
    reminderTitle: "预约提醒",
    reminderBody: (name) => `${name} 您好，提醒您的预约将在2天后到来。`,
    cancelSubject: "预约已取消 - 博多一瑞亭",
    cancelTitle: "预约已取消",
    cancelBody: (name) => `${name} 您好，您的预约已被取消。`,
  },
  "zh-TW": {
    confirmSubject: "預約確認 - 博多一瑞亭",
    confirmTitle: "您的預約已確認！",
    confirmGreeting: (name) => `${name} 您好，`,
    confirmBody: "以下是您的預約詳情：",
    date: "日期",
    time: "時間",
    partySize: "人數",
    course: "套餐",
    amount: "已付金額",
    closing: "期待您的光臨！\n\n博多一瑞亭\n東京都港區芝5丁目14-1",
    reminderSubject: "提醒：您在博多一瑞亭的預約",
    reminderTitle: "預約提醒",
    reminderBody: (name) => `${name} 您好，提醒您的預約將在2天後到來。`,
    cancelSubject: "預約已取消 - 博多一瑞亭",
    cancelTitle: "預約已取消",
    cancelBody: (name) => `${name} 您好，您的預約已被取消。`,
  },
  ko: {
    confirmSubject: "예약 확인 - 하카타 잇스이테이",
    confirmTitle: "예약이 확정되었습니다!",
    confirmGreeting: (name) => `${name}님,`,
    confirmBody: "예약 상세 정보:",
    date: "날짜",
    time: "시간",
    partySize: "인원",
    course: "코스",
    amount: "결제 금액",
    closing: "방문을 기다리겠습니다!\n\n하카타 잇스이테이\n도쿄도 미나토구 시바 5-14-1",
    reminderSubject: "알림: 하카타 잇스이테이 예약",
    reminderTitle: "예약 알림",
    reminderBody: (name) => `${name}님, 예약이 이틀 후에 있음을 알려드립니다.`,
    cancelSubject: "예약 취소 - 하카타 잇스이테이",
    cancelTitle: "예약 취소",
    cancelBody: (name) => `${name}님, 예약이 취소되었습니다.`,
  },
  th: {
    confirmSubject: "ยืนยันการจอง - ฮากาตะ อิสซุยเต",
    confirmTitle: "การจองของคุณได้รับการยืนยันแล้ว!",
    confirmGreeting: (name) => `เรียน ${name},`,
    confirmBody: "รายละเอียดการจองของคุณ:",
    date: "วันที่",
    time: "เวลา",
    partySize: "จำนวนคน",
    course: "คอร์ส",
    amount: "ยอดชำระ",
    closing: "เราหวังว่าจะได้พบคุณ!\n\nฮากาตะ อิสซุยเต\nชิบะ 5-14-1 มินาโตะ โตเกียว",
    reminderSubject: "แจ้งเตือน: การจองที่ ฮากาตะ อิสซุยเต",
    reminderTitle: "แจ้งเตือนการจอง",
    reminderBody: (name) => `เรียน ${name}, นี่คือการแจ้งเตือนว่าการจองของคุณจะมาถึงใน 2 วัน`,
    cancelSubject: "ยกเลิกการจอง - ฮากาตะ อิสซุยเต",
    cancelTitle: "ยกเลิกการจอง",
    cancelBody: (name) => `เรียน ${name}, การจองของคุณถูกยกเลิกแล้ว`,
  },
};

function getT(lang: string) {
  return translations[lang] || translations.en;
}

function baseTemplate(title: string, body: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #ea580c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">${title}</h1>
  </div>
  <div style="background: white; border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 8px 8px;">
    ${body}
  </div>
</body>
</html>`;
}

export function confirmationEmail(lang: string, data: ReservationData) {
  const t = getT(lang);
  const body = `
    <p>${t.confirmGreeting(data.name)}</p>
    <p>${t.confirmBody}</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.date}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.visitDate}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.time}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.visitTime}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.partySize}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.partySize}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.course}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.courseName}</td></tr>
      <tr><td style="padding: 8px; color: #666;">${t.amount}</td><td style="padding: 8px; font-weight: bold;">¥${data.amountPaid.toLocaleString()}</td></tr>
    </table>
    <p style="white-space: pre-line;">${t.closing}</p>
  `;
  return { subject: t.confirmSubject, html: baseTemplate(t.confirmTitle, body) };
}

export function reminderEmail(lang: string, data: ReservationData) {
  const t = getT(lang);
  const body = `
    <p>${t.reminderBody(data.name)}</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.date}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.visitDate}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.time}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.visitTime}</td></tr>
      <tr><td style="padding: 8px; color: #666;">${t.partySize}</td><td style="padding: 8px;">${data.partySize}</td></tr>
    </table>
    <p style="white-space: pre-line;">${t.closing}</p>
  `;
  return { subject: t.reminderSubject, html: baseTemplate(t.reminderTitle, body) };
}

export function cancellationEmail(lang: string, data: ReservationData) {
  const t = getT(lang);
  const body = `
    <p>${t.cancelBody(data.name)}</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">${t.date}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.visitDate}</td></tr>
      <tr><td style="padding: 8px; color: #666;">${t.partySize}</td><td style="padding: 8px;">${data.partySize}</td></tr>
    </table>
  `;
  return { subject: t.cancelSubject, html: baseTemplate(t.cancelTitle, body) };
}
