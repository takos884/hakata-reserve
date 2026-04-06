"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BlockedDateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.get("date"),
        note: form.get("note"),
      }),
    });
    setLoading(false);
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex gap-4 items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">日付</label>
        <input
          name="date"
          type="date"
          required
          className="border rounded px-3 py-2 text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">メモ</label>
        <input
          name="note"
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="例: 年末年始休業"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
      >
        追加
      </button>
    </form>
  );
}
