import { notFound } from "next/navigation";
import { Card, ErrorNotice, FormActions, FormField, PageHeader, TextAreaField } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/(protected)/products/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Редактирование продукции" description="Изменение карточки продукции." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={updateProduct.bind(null, product.id)} className="grid gap-4">
          <FormField label="Название" name="name" defaultValue={product.name} />
          <FormField label="Артикул" name="article" defaultValue={product.article} />
          <FormField label="Единица измерения" name="unit" defaultValue={product.unit} />
          <TextAreaField label="Описание" name="description" defaultValue={product.description} />
          <FormActions cancelHref="/products" />
        </form>
      </Card>
    </>
  );
}
