import { LockKeyhole, Truck } from "lucide-react";
import { redirect } from "next/navigation";
import { ErrorNotice } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { loginAction } from "@/app/login/actions";

type LoginPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const error = getErrorParam(resolvedSearchParams);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Truck className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">LogiControl</h1>
            <p className="text-sm text-slate-500">Вход администратора</p>
          </div>
        </div>

        <ErrorNotice message={error} />

        <form action={loginAction} className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Логин
            <input
              name="login"
              type="text"
              autoComplete="username"
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Пароль
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            Войти
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Тестовый доступ: <span className="font-medium text-slate-900">admin / admin123</span>
        </div>
      </div>
    </main>
  );
}
