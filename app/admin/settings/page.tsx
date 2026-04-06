import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const settingItems = [
    {
      href: "/admin/settings/blocked-dates",
      title: "休業日管理",
      description: "休業日の追加・削除を行います",
    },
    {
      href: "/admin/settings/courses",
      title: "コース・メニュー管理",
      description: "コースの追加・編集・無効化を行います",
    },
    {
      href: "/admin/settings/cancellation",
      title: "キャンセルポリシー",
      description: "キャンセル手数料の設定を行います",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
