import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseForm } from "./course-form";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">コース・メニュー管理</h1>

      <CourseForm />

      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">コース名（日本語）</th>
              <th className="text-left px-4 py-3">英語</th>
              <th className="text-left px-4 py-3">価格</th>
              <th className="text-left px-4 py-3">状態</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{c.nameJa}</td>
                <td className="px-4 py-3">{c.nameEn}</td>
                <td className="px-4 py-3">{`¥${c.price.toLocaleString()}`}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      c.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {c.isActive ? "有効" : "無効"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
