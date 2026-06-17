import { SupplyStatus } from "@/generated/prisma/client";
import { notFound } from "next/navigation";
import { Card, ErrorNotice, FormActions, FormField, PageHeader, SelectField } from "@/components/ui";
import { formatDateInput, supplyStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { updateSupply } from "@/app/(protected)/supplies/actions";

type EditSupplyPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
};

const statusOptions = Object.values(SupplyStatus).map((status) => ({
  value: status,
  label: supplyStatusLabels[status],
}));

export default async function EditSupplyPage({ params, searchParams }: EditSupplyPageProps) {
  const { id } = await params;
  const supplyId = Number(id);

  if (!Number.isInteger(supplyId)) {
    notFound();
  }

  const [supply, suppliers, warehouses, products, resolvedSearchParams] = await Promise.all([
    prisma.supply.findUnique({ where: { id: supplyId } }),
    prisma.supplier.findMany({ orderBy: { organization: "asc" } }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    searchParams,
  ]);

  if (!supply) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Редактирование поставки" description="Изменение данных поставки и корректировка остатков." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={updateSupply.bind(null, supply.id)} className="grid gap-4">
          <SelectField
            label="Поставщик"
            name="supplierId"
            defaultValue={supply.supplierId}
            options={suppliers.map((supplier) => ({ value: supplier.id, label: supplier.organization }))}
          />
          <SelectField
            label="Склад"
            name="warehouseId"
            defaultValue={supply.warehouseId}
            options={warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))}
          />
          <SelectField
            label="Продукция"
            name="productId"
            defaultValue={supply.productId}
            options={products.map((product) => ({ value: product.id, label: `${product.name} (${product.article})` }))}
          />
          <FormField label="Количество" name="quantity" type="number" defaultValue={supply.quantity} />
          <FormField label="Дата поставки" name="supplyDate" type="date" defaultValue={formatDateInput(supply.supplyDate)} />
          <SelectField label="Статус" name="status" options={statusOptions} defaultValue={supply.status} />
          <FormActions cancelHref="/supplies" />
        </form>
      </Card>
    </>
  );
}
