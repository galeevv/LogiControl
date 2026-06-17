import { ShipmentStatus } from "@/generated/prisma/client";
import { Card, EmptyState, ErrorNotice, FormActions, FormField, PageHeader, SelectField } from "@/components/ui";
import { shipmentStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { createShipment } from "@/app/(protected)/shipments/actions";

type NewShipmentPageProps = {
  searchParams?: Promise<SearchParams>;
};

const statusOptions = Object.values(ShipmentStatus).map((status) => ({
  value: status,
  label: shipmentStatusLabels[status],
}));

export default async function NewShipmentPage({ searchParams }: NewShipmentPageProps) {
  const [customers, warehouses, products, vehicles, resolvedSearchParams] = await Promise.all([
    prisma.customer.findMany({ orderBy: { organization: "asc" } }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({ orderBy: { licensePlate: "asc" } }),
    searchParams,
  ]);

  const canCreate = customers.length > 0 && warehouses.length > 0 && products.length > 0 && vehicles.length > 0;

  return (
    <>
      <PageHeader title="Новая отгрузка" description="Регистрация отправки продукции клиенту." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {!canCreate ? (
        <EmptyState text="Для создания отгрузки добавьте клиента, склад, продукцию и транспорт." />
      ) : (
        <Card className="p-6">
          <form action={createShipment} className="grid gap-4">
            <SelectField
              label="Клиент"
              name="customerId"
              options={customers.map((customer) => ({ value: customer.id, label: customer.organization }))}
            />
            <SelectField
              label="Склад"
              name="warehouseId"
              options={warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))}
            />
            <SelectField
              label="Продукция"
              name="productId"
              options={products.map((product) => ({ value: product.id, label: `${product.name} (${product.article})` }))}
            />
            <SelectField
              label="Транспорт"
              name="vehicleId"
              options={vehicles.map((vehicle) => ({ value: vehicle.id, label: `${vehicle.licensePlate} — ${vehicle.brand}` }))}
            />
            <FormField label="Количество" name="quantity" type="number" />
            <FormField label="Дата отгрузки" name="shipmentDate" type="date" />
            <SelectField label="Статус" name="status" options={statusOptions} defaultValue={ShipmentStatus.PLANNED} />
            <FormActions cancelHref="/shipments" />
          </form>
        </Card>
      )}
    </>
  );
}
