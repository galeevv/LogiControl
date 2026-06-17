import Link from "next/link";
import {
  Boxes,
  Building2,
  LayoutDashboard,
  LogOut,
  Package,
  PackageCheck,
  PackageMinus,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navigation: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/", label: "Панель", icon: LayoutDashboard },
  { href: "/products", label: "Продукция", icon: Package },
  { href: "/warehouses", label: "Склады", icon: Warehouse },
  { href: "/suppliers", label: "Поставщики", icon: Building2 },
  { href: "/customers", label: "Клиенты", icon: Users },
  { href: "/vehicles", label: "Транспорт", icon: Truck },
  { href: "/supplies", label: "Поставки", icon: PackageCheck },
  { href: "/shipments", label: "Отгрузки", icon: PackageMinus },
  { href: "/stocks", label: "Остатки", icon: Boxes },
];

export function AppShell({
  children,
  userLogin,
}: Readonly<{
  children: React.ReactNode;
  userLogin: string;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-semibold text-slate-950">LogiControl</span>
                <span className="block text-xs text-slate-500">управление логистикой</span>
              </span>
            </Link>
          </div>

          <nav className="grid gap-1 px-3 py-4 sm:grid-cols-2 lg:block">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <Icon className="h-4 w-4 text-teal-700" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-200 px-4 py-4">
            <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <div className="text-xs text-slate-500">Администратор</div>
              <div className="font-medium text-slate-900">{userLogin}</div>
            </div>
            <form action="/logout" method="post">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Выйти
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-72 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
