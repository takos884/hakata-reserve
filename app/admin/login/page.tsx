"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <p className="text-[#d4a853] text-xs tracking-[0.4em] uppercase mb-3">ADMIN</p>
          <h1 className="text-3xl font-light text-gray-100 tracking-widest mb-1">博多一瑞亭</h1>
          <p className="text-gray-600 text-xs tracking-widest">管理画面</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-8 bg-[#d4a853]/40" />
            <div className="w-1 h-1 rounded-full bg-[#d4a853]/60" />
            <div className="h-px w-8 bg-[#d4a853]/40" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#111] border border-[#222] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center tracking-wider">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 tracking-widest uppercase mb-2">
                メールアドレス
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-[#1c1c1c] border border-[#333] text-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853]/30 placeholder-gray-600 transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 tracking-widest uppercase mb-2">
                パスワード
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-[#1c1c1c] border border-[#333] text-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-1 focus:ring-[#d4a853]/30 placeholder-gray-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#d4a853] text-black font-semibold tracking-widest text-sm uppercase hover:bg-[#c4963f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-8 tracking-wider">
          © 2026 Hakata Issuitei · Admin Portal
        </p>
      </div>
    </div>
  );
}
