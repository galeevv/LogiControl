import { ShipmentStatus } from "@/generated/prisma/client";
import { notFound } from "next/navigation";
import { Card, ErrorNotice, FormActions, FormField, PageHeader, SelectField } from "@/components/ui";
import { formatDateInput, shipmentStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { updateShipment } from "@/app/(protected)/shipments/actions";

type EditShipmentPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
};

const statusOptions = Object.values(ShipmentStatus).map((status) => ({
  value: status,
  label: shipmentStatusLabels[status],
}));

export default async function EditShipmentPage({ params, searchParams }: EditShipmentPageProps) {
  const { id } = await params;
  const shipmentId = Number(id);

  if (!Number.isInteger(shipmentId)) {
    notFound();
  }

  const [shipment, customers, warehouses, products, vehicles, resolvedSearchParams] = await Promise.all([
    prisma.shipment.findUnique({ where: { id: shipmentId } }),
    prisma.customer.findMany({ orderBy: { organization: "asc" } }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({ orderBy: { licensePlate: "asc" } }),
    searchParams,
  ]);

  if (!shipment) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Редактирование отгрузки" description="Изменение данных отгрузки и корректировка остатков." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={updateShipment.bind(null, shipment.id)} className="grid gap-4">
          <SelectField
            label="Клиент"
            name="customerId"
            defaultValue={shipment.customerId}
            options={customers.map((customer) => ({ value: customer.id, label: customer.organization }))}
          />
          <SelectField
            label="Склад"
            name="warehouseId"
            defaultValue={shipment.warehouseId}
            options={warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))}
          />
          <SelectField
            label="Продукция"
            name="productId"
            defaultValue={shipment.productId}
            options={products.map((product) => ({ value: product.id, label: `${product.name} (${product.article})` }))}
          />
          <SelectField
            label="Транспорт"
            name="vehicleId"
            defaultValue={shipment.vehicleId}
            options={vehicles.map((vehicle) => ({ value: vehicle.id, label: `${vehicle.licensePlate} — ${vehicle.brand}` }))}
          />
          <FormField label="Количество" name="quantity" type="number" defaultValue={shipment.quantity} />
          <FormField label="Дата отгрузки" name="shipmentDate" type="date" defaultValue={formatDateInput(shipment.shipmentDate)} />
          <SelectField label="Статус" name="status" options={statusOptions} defaultValue={shipment.status} />
          <FormActions cancelHref="/shipments" />
        </form>
      </Card>
    </>
  );
}
