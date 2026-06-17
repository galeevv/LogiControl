import { PackageMinus, Pencil } from "lucide-react";
import Link from "next/link";
import { DeleteButton, EmptyState, ErrorNotice, PageHeader, StatusBadge, TableShell } from "@/components/ui";
import { formatDate, formatNumber, shipmentStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { deleteShipment } from "@/app/(protected)/shipments/actions";

type ShipmentsPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function ShipmentsPage({ searchParams }: ShipmentsPageProps) {
  const shipments = await prisma.shipment.findMany({
    include: {
      customer: true,
      warehouse: true,
      product: true,
      vehicle: true,
    },
    orderBy: { shipmentDate: "desc" },
  });
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader
        title="Отгрузки"
        description="Отгрузка продукции клиентам с учетом склада и транспорта."
        actionHref="/shipments/new"
        actionLabel="Создать отгрузку"
        actionIcon={PackageMinus}
      />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {shipments.length === 0 ? (
        <EmptyState text="Отгрузки пока не добавлены." />
      ) : (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Клиент</th>
                <th className="px-4 py-3">Склад</th>
                <th className="px-4 py-3">Продукция</th>
                <th className="px-4 py-3">Транспорт</th>
                <th className="px-4 py-3">Количество</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="px-4 py-3 text-slate-600">{formatDate(shipment.shipmentDate)}</td>
                  <td className="px-4 py-3 font-medium text-slate-950">{shipment.customer.organization}</td>
                  <td className="px-4 py-3 text-slate-600">{shipment.warehouse.name}</td>
                  <td className="px-4 py-3 text-slate-600">{shipment.product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{shipment.vehicle.licensePlate}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatNumber(shipment.quantity)} {shipment.product.unit}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge>{shipmentStatusLabels[shipment.status]}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/shipments/${shipment.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Редактировать
                      </Link>
                      <form action={deleteShipment.bind(null, shipment.id)}>
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
