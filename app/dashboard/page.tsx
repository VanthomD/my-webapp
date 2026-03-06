import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NcStatus } from "@prisma/client";
import DashboardCharts from "./charts";

export default async function DashboardPage() {
  const byStatus = await prisma.nonConformity.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const statusData = Object.values(NcStatus).map((status) => ({
    name: status,
    value: byStatus.find((x) => x.status === status)?._count._all ?? 0,
  }));

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link className="text-sm underline" href="/ncs">
              Naar NC’s
            </Link>
            <Link
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              href="/ncs/new"
            >
              + Nieuw
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {statusData.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="text-xs text-gray-500">{item.name}</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <DashboardCharts statusData={statusData} />
      </div>
    </main>
  );
}
