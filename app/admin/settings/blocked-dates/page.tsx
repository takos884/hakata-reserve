import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BlockedDateForm } from "./blocked-date-form";

export default async function BlockedDatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const blockedDates = await prisma.blockedDate.findMany({
    orderBy: { date: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">休業日管理</h1>

      <BlockedDateForm />

      <div className="bg-white rounded-lg shadow mt-6 p-6">
        <h3 className="font-semibold mb-4">登録済み休業日</h3>
        {blockedDates.length === 0 ? (
          <p className="text-gray-500 text-sm">休業日が登録されていません</p>
        ) : (
          <div className="space-y-2">
            {blockedDates.map((bd) => (
              <div
                key={bd.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <span className="font-medium">
                    {bd.date.toLocaleDateString("ja-JP")}
                  </span>
                  {bd.note && (
                    <span className="ml-2 text-sm text-gray-500">{bd.note}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
