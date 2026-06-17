import {
  Boxes,
  Package,
  PackageCheck,
  PackageMinus,
  Truck,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, PageHeader, StatusBadge, TableShell } from "@/components/ui";
import {
  formatDate,
  formatDateTime,
  formatNumber,
  shipmentStatusLabels,
  supplyStatusLabels,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";

type StatCard = {
  label: string;
  value: number;
  icon: LucideIcon;
};

type OperationRow = {
  id: string;
  type: "Поставка" | "Отгрузка";
  date: Date;
  party: string;
  warehouse: string;
  product: string;
  quantity: string;
  status: string;
};

export default async function DashboardPage() {
  const [
    productCount,
    warehouseCount,
    supplyCount,
    shipmentCount,
    vehicleCount,
    latestSupplies,
    latestShipments,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.warehouse.count(),
    prisma.supply.count(),
    prisma.shipment.count(),
    prisma.vehicle.count(),
    prisma.supply.findMany({
      take: 5,
      include: {
        supplier: true,
        warehouse: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shipment.findMany({
      take: 5,
      include: {
        customer: true,
        warehouse: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats: StatCard[] = [
    { label: "Продукция", value: productCount, icon: Package },
    { label: "Склады", value: warehouseCount, icon: Warehouse },
    { label: "Поставки", value: supplyCount, icon: PackageCheck },
    { label: "Отгрузки", value: shipmentCount, icon: PackageMinus },
    { label: "Транспорт", value: vehicleCount, icon: Truck },
  ];

  const operations: OperationRow[] = [
    ...latestSupplies.map((supply) => ({
      id: `supply-${supply.id}`,
      type: "Поставка" as const,
      date: supply.createdAt,
      party: supply.supplier.organization,
      warehouse: supply.warehouse.name,
      product: supply.product.name,
      quantity: `${formatNumber(supply.quantity)} ${supply.product.unit}`,
      status: supplyStatusLabels[supply.status],
    })),
    ...latestShipments.map((shipment) => ({
      id: `shipment-${shipment.id}`,
      type: "Отгрузка" as const,
      date: shipment.createdAt,
      party: shipment.customer.organization,
      warehouse: shipment.warehouse.name,
      product: shipment.product.name,
      quantity: `${formatNumber(shipment.quantity)} ${shipment.product.unit}`,
      status: shipmentStatusLabels[shipment.status],
    })),
  ]
    .sort((left, right) => right.date.getTime() - left.date.getTime())
    .slice(0, 8);

  return (
    <>
      <PageHeader
        title="Главная панель"
        description="Краткая сводка по справочникам, логистическим операциям и последним изменениям."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{formatNumber(stat.value)}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-teal-700" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-slate-950">Последние операции</h2>
          </div>
          <div className="grid gap-3">
            {operations.slice(0, 4).map((operation) => (
              <div key={operation.id} className="flex flex-col gap-2 rounded-lg border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-slate-950">{operation.type}: {operation.product}</div>
                  <div className="text-sm text-slate-500">{operation.party}, {operation.warehouse}</div>
                </div>
                <div className="text-sm text-slate-500">{formatDateTime(operation.date)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-950">Состояние системы</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-slate-500">Справочники</dt>
              <dd className="font-medium text-slate-950">активны</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-slate-500">Учет остатков</dt>
              <dd className="font-medium text-slate-950">автоматический</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <dt className="text-slate-500">Дата отчета</dt>
              <dd className="font-medium text-slate-950">{formatDate(new Date())}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <TableShell>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Контрагент</th>
              <th className="px-4 py-3">Склад</th>
              <th className="px-4 py-3">Продукция</th>
              <th className="px-4 py-3">Количество</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {operations.map((operation) => (
              <tr key={operation.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{operation.type}</td>
                <td className="px-4 py-3 text-slate-600">{operation.party}</td>
                <td className="px-4 py-3 text-slate-600">{operation.warehouse}</td>
                <td className="px-4 py-3 text-slate-600">{operation.product}</td>
                <td className="px-4 py-3 text-slate-600">{operation.quantity}</td>
                <td className="px-4 py-3">
                  <StatusBadge>{operation.status}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(operation.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </>
  );
}
