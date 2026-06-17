import { Pencil, Warehouse as WarehouseIcon } from "lucide-react";
import Link from "next/link";
import { DeleteButton, EmptyState, ErrorNotice, PageHeader, TableShell } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { deleteWarehouse } from "@/app/(protected)/warehouses/actions";

type WarehousesPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function WarehousesPage({ searchParams }: WarehousesPageProps) {
  const warehouses = await prisma.warehouse.findMany({
    orderBy: { createdAt: "desc" },
  });
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader
        title="Склады"
        description="Справочник складских площадок и ответственных лиц."
        actionHref="/warehouses/new"
        actionLabel="Добавить склад"
        actionIcon={WarehouseIcon}
      />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {warehouses.length === 0 ? (
        <EmptyState text="Склады пока не добавлены." />
      ) : (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Адрес</th>
                <th className="px-4 py-3">Вместимость</th>
                <th className="px-4 py-3">Ответственный</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{warehouse.name}</td>
                  <td className="px-4 py-3 text-slate-600">{warehouse.address}</td>
                  <td className="px-4 py-3 text-slate-600">{formatNumber(warehouse.capacity)}</td>
                  <td className="px-4 py-3 text-slate-600">{warehouse.manager}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/warehouses/${warehouse.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Редактировать
                      </Link>
                      <form action={deleteWarehouse.bind(null, warehouse.id)}>
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
