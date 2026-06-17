import { Card, ErrorNotice, FormActions, FormField, PageHeader } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { createSupplier } from "@/app/(protected)/suppliers/actions";

type NewSupplierPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function NewSupplierPage({ searchParams }: NewSupplierPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Новый поставщик" description="Добавление организации-поставщика." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={createSupplier} className="grid gap-4">
          <FormField label="Название организации" name="organization" />
          <FormField label="Контактное лицо" name="contactPerson" />
          <FormField label="Телефон" name="phone" />
          <FormField label="Email" name="email" type="email" />
          <FormField label="Адрес" name="address" />
          <FormActions cancelHref="/suppliers" />
        </form>
      </Card>
    </>
  );
}
