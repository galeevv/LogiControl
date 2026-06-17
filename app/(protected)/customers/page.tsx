import { Pencil, UserPlus } from "lucide-react";
import Link from "next/link";
import { DeleteButton, EmptyState, ErrorNotice, PageHeader, TableShell } from "@/components/ui";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { deleteCustomer } from "@/app/(protected)/customers/actions";

type CustomersPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader
        title="Клиенты"
        description="Получатели продукции и заказчики отгрузок."
        actionHref="/customers/new"
        actionLabel="Добавить клиента"
        actionIcon={UserPlus}
      />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      {customers.length === 0 ? (
        <EmptyState text="Клиенты пока не добавлены." />
      ) : (
        <TableShell>
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Организация</th>
                <th className="px-4 py-3">Контактное лицо</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Адрес</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{customer.organization}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.contactPerson}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/customers/${customer.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Редактировать
                      </Link>
                      <form action={deleteCustomer.bind(null, customer.id)}>
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
