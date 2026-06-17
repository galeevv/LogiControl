import { Prisma } from "@/generated/prisma/client";

export type SearchParams = Record<string, string | string[] | undefined>;

export function getString(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export function getRequiredString(formData: FormData, name: string): string {
  const value = getString(formData, name);

  if (!value) {
    throw new Error("Заполните все обязательные поля.");
  }

  return value;
}

export function getRequiredInt(formData: FormData, name: string): number {
  const value = Number(getString(formData, name));

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("Числовые значения должны быть положительными целыми числами.");
  }

  return value;
}

export function getRequiredDate(formData: FormData, name: string): Date {
  const rawValue = getRequiredString(formData, name);
  const date = new Date(`${rawValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Укажите корректную дату.");
  }

  return date;
}

export function getSingleSearchParam(
  searchParams: SearchParams | undefined,
  name: string,
): string | undefined {
  const value = searchParams?.[name];
  return Array.isArray(value) ? value[0] : value;
}

export function getErrorParam(searchParams: SearchParams | undefined): string | undefined {
  const error = getSingleSearchParam(searchParams, "error");
  return error ? decodeURIComponent(error) : undefined;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Запись с такими уникальными данными уже существует.";
    }

    if (error.code === "P2003") {
      return "Нельзя удалить запись, потому что она используется в связанных операциях.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось выполнить операцию.";
}
