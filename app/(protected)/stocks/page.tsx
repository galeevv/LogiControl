import { Prisma } from "@/generated/prisma/client";
import { Filter } from "lucide-react";
import { EmptyState, PageHeader, TableShell } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { getSingleSearchParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";

type StocksPageProps = {
  searchParams?: Promise<SearchParams>;
};

function readFilterId(searchParams: SearchParams | undefined, name: string): number | undefined {
  const value = getSingleSearchParam(searchParams, name);

  if (!value) {
    return undefined;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export default async function StocksPage({ searchParams }: StocksPageProps) {
  const resolvedSearchParams = await searchParams;
  const warehouseId = readFilterId(resolvedSearchParams, "warehouseId");
  const productId = readFilterId(resolvedSearchParams, "productId");
  const where: Prisma.StockWhereInput = {};

  if (warehouseId) {
    where.warehouseId = warehouseId;
  }

  if (productId) {
    where.productId = productId;
  }

  const [stocks, warehouses, products] = await Promise.all([
    prisma.stock.findMany({
      where,
      include: {
        warehouse: true,
        product: true,
      },
      orderBy: [{ warehouse: { name: "asc" } }, { product: { name: "asc" } }],
    }),
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Остатки"
        description="Текущие остатки продукции по складам с фильтрацией."
      />

      <form className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]" method="get">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Склад
          <select
            name="warehouseId"
            defaultValue={warehouseId ?? ""}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Все склады</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Продукция
          <select
            name="productId"
            defaultValue={productId ?? ""}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Вся продукция</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 md:self-end"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Применить
        </button>
      </form>

      {stocks.length === 0 ? (
        <EmptyState text="Остатки по выбранным фильтрам не найдены." />
      ) : (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Склад</th>
                <th className="px-4 py-3">Продукция</th>
                <th className="px-4 py-3">Артикул</th>
                <th className="px-4 py-3">Количество</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stocks.map((stock) => (
                <tr key={stock.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{stock.warehouse.name}</td>
                  <td className="px-4 py-3 text-slate-600">{stock.product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{stock.product.article}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatNumber(stock.quantity)} {stock.product.unit}
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
