import { Pencil, Truck } from "lucide-react";
import Link from "next/link";
import { DeleteButton, EmptyState, ErrorNotice, PageHeader, StatusBadge, TableShell } from "@/components/ui";
import { formatNumber, vehicleStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { deleteVehicle } from "@/app/(protected)/vehicles/actions";

type VehiclesPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader
        title="Транспорт"
        description="Справочник транспортных средств и водителей."
        actionHref="/vehicles/new"
        actionLabel="Добавить транспорт"
        actionIcon={Truck}
      />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {vehicles.length === 0 ? (
        <EmptyState text="Транспорт пока не добавлен." />
      ) : (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Марка</th>
                <th className="px-4 py-3">Гос. номер</th>
                <th className="px-4 py-3">Грузоподъемность</th>
                <th className="px-4 py-3">Водитель</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{vehicle.brand}</td>
                  <td className="px-4 py-3 text-slate-600">{vehicle.licensePlate}</td>
                  <td className="px-4 py-3 text-slate-600">{formatNumber(vehicle.loadCapacity)} кг</td>
                  <td className="px-4 py-3 text-slate-600">{vehicle.driver}</td>
                  <td className="px-4 py-3">
                    <StatusBadge>{vehicleStatusLabels[vehicle.status]}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/vehicles/${vehicle.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Редактировать
                      </Link>
                      <form action={deleteVehicle.bind(null, vehicle.id)}>
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </>
  );
}
