import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CancellationForm } from "./cancellation-form";

export default async function CancellationPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const policies = await prisma.cancellationPolicy.findMany({
    orderBy: { daysBeforeMin: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">キャンセルポリシー設定</h1>

      <CancellationForm policies={policies} />

      <div className="bg-white rounded-lg shadow mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">来店までの日数</th>
              <th className="text-left px-4 py-3">手数料率</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3">
                  {p.daysBeforeMax
                    ? `${p.daysBeforeMin}〜${p.daysBeforeMax}日前`
                    : `${p.daysBeforeMin}日以上前`}
                </td>
                <td className="px-4 py-3">
                  {p.feePercent === 0 ? "無料" : `${p.feePercent}%`}
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                  ポリシーが設定されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
