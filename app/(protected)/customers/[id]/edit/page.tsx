import { notFound } from "next/navigation";
import { Card, ErrorNotice, FormActions, FormField, PageHeader } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { updateCustomer } from "@/app/(protected)/customers/actions";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function EditCustomerPage({ params, searchParams }: EditCustomerPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  if (!Number.isInteger(customerId)) {
    notFound();
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Редактирование клиента" description="Изменение карточки клиента." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={updateCustomer.bind(null, customer.id)} className="grid gap-4">
          <FormField label="Название организации" name="organization" defaultValue={customer.organization} />
          <FormField label="Контактное лицо" name="contactPerson" defaultValue={customer.contactPerson} />
          <FormField label="Телефон" name="phone" defaultValue={customer.phone} />
          <FormField label="Email" name="email" type="email" defaultValue={customer.email} />
          <FormField label="Адрес" name="address" defaultValue={customer.address} />
          <FormActions cancelHref="/customers" />
        </form>
      </Card>
    </>
  );
}
