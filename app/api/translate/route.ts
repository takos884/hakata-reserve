import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, targetLang = "ja" } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();

    // Google returns [[["translated","original",...],...],...]
    const translated = (data[0] as [string, string][])
      .map((segment: [string, string]) => segment[0])
      .join("");

    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
