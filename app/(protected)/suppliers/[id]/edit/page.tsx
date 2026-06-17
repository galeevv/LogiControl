import { notFound } from "next/navigation";
import { Card, ErrorNotice, FormActions, FormField, PageHeader } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { updateSupplier } from "@/app/(protected)/suppliers/actions";

type EditSupplierPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function EditSupplierPage({ params, searchParams }: EditSupplierPageProps) {
  const { id } = await params;
  const supplierId = Number(id);

  if (!Number.isInteger(supplierId)) {
    notFound();
  }

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  });

  if (!supplier) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Редактирование поставщика" description="Изменение карточки поставщика." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={updateSupplier.bind(null, supplier.id)} className="grid gap-4">
          <FormField label="Название организации" name="organization" defaultValue={supplier.organization} />
          <FormField label="Контактное лицо" name="contactPerson" defaultValue={supplier.contactPerson} />
          <FormField label="Телефон" name="phone" defaultValue={supplier.phone} />
          <FormField label="Email" name="email" type="email" defaultValue={supplier.email} />
          <FormField label="Адрес" name="address" defaultValue={supplier.address} />
          <FormActions cancelHref="/suppliers" />
        </form>
      </Card>
    </>
  );
}
