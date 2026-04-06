"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CourseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      nameJa: form.get("nameJa"),
      nameEn: form.get("nameEn"),
      nameZhCN: form.get("nameZhCN"),
      nameZhTW: form.get("nameZhTW"),
      nameKo: form.get("nameKo"),
      nameTh: form.get("nameTh"),
      price: Number(form.get("price")),
      description: form.get("description"),
    };

    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
      >
        新規コース追加
      </button>
    );
  }

  const fields = [
    { name: "nameJa", label: "コース名（日本語）" },
    { name: "nameEn", label: "Course Name (English)" },
    { name: "nameZhCN", label: "课程名称（简体中文）" },
    { name: "nameZhTW", label: "課程名稱（繁體中文）" },
    { name: "nameKo", label: "코스명 (한국어)" },
    { name: "nameTh", label: "ชื่อคอร์ส (ภาษาไทย)" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold">新規コース追加</h3>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
            <input
              name={f.name}
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs text-gray-500 mb-1">価格（円）</label>
          <input
            name="price"
            type="number"
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">説明</label>
          <input
            name="description"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "保存中..." : "保存"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 bg-gray-200 rounded text-sm"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
