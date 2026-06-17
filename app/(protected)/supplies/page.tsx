import { PackageCheck, Pencil } from "lucide-react";
import Link from "next/link";
import { DeleteButton, EmptyState, ErrorNotice, PageHeader, StatusBadge, TableShell } from "@/components/ui";
import { formatDate, formatNumber, supplyStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { deleteSupply } from "@/app/(protected)/supplies/actions";

type SuppliesPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function SuppliesPage({ searchParams }: SuppliesPageProps) {
  const supplies = await prisma.supply.findMany({
    include: {
      supplier: true,
      warehouse: true,
      product: true,
    },
    orderBy: { supplyDate: "desc" },
  });
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader
        title="Поставки"
        description="Поступление продукции и материалов на склады предприятия."
        actionHref="/supplies/new"
        actionLabel="Создать поставку"
        actionIcon={PackageCheck}
      />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {supplies.length === 0 ? (
        <EmptyState text="Поставки пока не добавлены." />
      ) : (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Поставщик</th>
                <th className="px-4 py-3">Склад</th>
                <th className="px-4 py-3">Продукция</th>
                <th className="px-4 py-3">Количество</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supplies.map((supply) => (
                <tr key={supply.id}>
                  <td className="px-4 py-3 text-slate-600">{formatDate(supply.supplyDate)}</td>
                  <td className="px-4 py-3 font-medium text-slate-950">{supply.supplier.organization}</td>
                  <td className="px-4 py-3 text-slate-600">{supply.warehouse.name}</td>
                  <td className="px-4 py-3 text-slate-600">{supply.product.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatNumber(supply.quantity)} {supply.product.unit}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge>{supplyStatusLabels[supply.status]}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/supplies/${supply.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Редактировать
                      </Link>
                      <form action={deleteSupply.bind(null, supply.id)}>
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
