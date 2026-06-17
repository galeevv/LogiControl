import { PackagePlus, Pencil } from "lucide-react";
import Link from "next/link";
import { DeleteButton, EmptyState, ErrorNotice, PageHeader, TableShell } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/app/(protected)/products/actions";

type ProductsPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader
        title="Продукция"
        description="Справочник выпускаемой и закупаемой продукции предприятия."
        actionHref="/products/new"
        actionLabel="Добавить продукцию"
        actionIcon={PackagePlus}
      />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {products.length === 0 ? (
        <EmptyState text="Продукция пока не добавлена." />
      ) : (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Артикул</th>
                <th className="px-4 py-3">Ед. изм.</th>
                <th className="px-4 py-3">Описание</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.article}</td>
                  <td className="px-4 py-3 text-slate-600">{product.unit}</td>
                  <td className="max-w-md px-4 py-3 text-slate-600">{product.description || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Редактировать
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </>
  );
}
