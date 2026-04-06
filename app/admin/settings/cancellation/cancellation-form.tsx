"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Policy = {
  id: string;
  daysBeforeMin: number;
  daysBeforeMax: number | null;
  feePercent: number;
};

export function CancellationForm({ policies }: { policies: Policy[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/cancellation-policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        daysBeforeMin: Number(form.get("daysBeforeMin")),
        daysBeforeMax: form.get("daysBeforeMax")
          ? Number(form.get("daysBeforeMax"))
          : null,
        feePercent: Number(form.get("feePercent")),
      }),
    });
    setLoading(false);
    e.currentTarget.reset();
    router.refresh();
  }

  async function handleSeedDefaults() {
    setLoading(true);
    await fetch("/api/cancellation-policies/seed", { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {policies.length === 0 && (
        <button
          onClick={handleSeedDefaults}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          デフォルトポリシーを適用
        </button>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 flex gap-4 items-end"
      >
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            最小日数
          </label>
          <input
            name="daysBeforeMin"
            type="number"
            min={0}
            required
            className="w-24 border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            最大日数（空欄=上限なし）
          </label>
          <input
            name="daysBeforeMax"
            type="number"
            min={0}
            className="w-24 border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">手数料率（%）</label>
          <input
            name="feePercent"
            type="number"
            min={0}
            max={100}
            required
            className="w-24 border rounded px-3 py-2 text-sm"
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
    </div>
  );
}
