import { notFound } from "next/navigation";
import { Card, ErrorNotice, FormActions, FormField, PageHeader } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { updateWarehouse } from "@/app/(protected)/warehouses/actions";

type EditWarehousePageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function EditWarehousePage({ params, searchParams }: EditWarehousePageProps) {
  const { id } = await params;
  const warehouseId = Number(id);

  if (!Number.isInteger(warehouseId)) {
    notFound();
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { id: warehouseId },
  });

  if (!warehouse) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Редактирование склада" description="Изменение данных складской площадки." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={updateWarehouse.bind(null, warehouse.id)} className="grid gap-4">
          <FormField label="Название" name="name" defaultValue={warehouse.name} />
          <FormField label="Адрес" name="address" defaultValue={warehouse.address} />
          <FormField label="Вместимость" name="capacity" type="number" defaultValue={warehouse.capacity} />
          <FormField label="Ответственное лицо" name="manager" defaultValue={warehouse.manager} />
          <FormActions cancelHref="/warehouses" />
        </form>
      </Card>
    </>
  );
}
