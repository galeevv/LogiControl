import { Card, ErrorNotice, FormActions, FormField, PageHeader } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { createWarehouse } from "@/app/(protected)/warehouses/actions";

type NewWarehousePageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function NewWarehousePage({ searchParams }: NewWarehousePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Новый склад" description="Добавление складской площадки." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={createWarehouse} className="grid gap-4">
          <FormField label="Название" name="name" />
          <FormField label="Адрес" name="address" />
          <FormField label="Вместимость" name="capacity" type="number" />
          <FormField label="Ответственное лицо" name="manager" />
          <FormActions cancelHref="/warehouses" />
        </form>
      </Card>
    </>
  );
}
