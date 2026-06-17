import { Card, ErrorNotice, FormActions, FormField, PageHeader, TextAreaField } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { createProduct } from "@/app/(protected)/products/actions";

type NewProductPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Новая продукция" description="Добавление позиции в справочник продукции." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={createProduct} className="grid gap-4">
          <FormField label="Название" name="name" />
          <FormField label="Артикул" name="article" />
          <FormField label="Единица измерения" name="unit" placeholder="шт, кг, м" />
          <TextAreaField label="Описание" name="description" />
          <FormActions cancelHref="/products" />
        </form>
      </Card>
    </>
  );
}
