import { Card, ErrorNotice, FormActions, FormField, PageHeader } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { createCustomer } from "@/app/(protected)/customers/actions";

type NewCustomerPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function NewCustomerPage({ searchParams }: NewCustomerPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Новый клиент" description="Добавление организации-клиента." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={createCustomer} className="grid gap-4">
          <FormField label="Название организации" name="organization" />
          <FormField label="Контактное лицо" name="contactPerson" />
          <FormField label="Телефон" name="phone" />
          <FormField label="Email" name="email" type="email" />
          <FormField label="Адрес" name="address" />
          <FormActions cancelHref="/customers" />
        </form>
      </Card>
    </>
  );
}
