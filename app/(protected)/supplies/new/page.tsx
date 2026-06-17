import { SupplyStatus } from "@/generated/prisma/client";
import { Card, EmptyState, ErrorNotice, FormActions, FormField, PageHeader, SelectField } from "@/components/ui";
import { supplyStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { createSupply } from "@/app/(protected)/supplies/actions";

type NewSupplyPageProps = {
  searchParams?: Promise<SearchParams>;
};

const statusOptions = Object.values(SupplyStatus).map((status) => ({
  value: status,
  label: supplyStatusLabels[status],
}));

export default async function NewSupplyPage({ searchParams }: NewSupplyPageProps) {
  const [suppliers, warehouses, products, resolvedSearchParams] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { organization: "asc" } }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    searchParams,
  ]);

  const canCreate = suppliers.length > 0 && warehouses.length > 0 && products.length > 0;

  return (
    <>
      <PageHeader title="Новая поставка" description="Регистрация поступления продукции на склад." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {!canCreate ? (
        <EmptyState text="Для создания поставки добавьте поставщика, склад и продукцию." />
      ) : (
        <Card className="p-6">
          <form action={createSupply} className="grid gap-4">
            <SelectField
              label="Поставщик"
              name="supplierId"
              options={suppliers.map((supplier) => ({ value: supplier.id, label: supplier.organization }))}
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
            <FormField label="Количество" name="quantity" type="number" />
            <FormField label="Дата поставки" name="supplyDate" type="date" />
            <SelectField label="Статус" name="status" options={statusOptions} defaultValue={SupplyStatus.PLANNED} />
            <FormActions cancelHref="/supplies" />
          </form>
        </Card>
      )}
    </>
  );
}
