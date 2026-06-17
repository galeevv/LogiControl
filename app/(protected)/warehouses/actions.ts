"use server";

import { redirect } from "next/navigation";
import { getErrorMessage, getRequiredInt, getRequiredString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";

function readWarehouseData(formData: FormData) {
  return {
    name: getRequiredString(formData, "name"),
    address: getRequiredString(formData, "address"),
    capacity: getRequiredInt(formData, "capacity"),
    manager: getRequiredString(formData, "manager"),
  };
}

export async function createWarehouse(formData: FormData): Promise<void> {
  try {
    await prisma.warehouse.create({ data: readWarehouseData(formData) });
  } catch (error) {
    redirectWithError("/warehouses/new", getErrorMessage(error));
  }

  redirect("/warehouses");
}

export async function updateWarehouse(id: number, formData: FormData): Promise<void> {
  try {
    await prisma.warehouse.update({
      where: { id },
      data: readWarehouseData(formData),
    });
  } catch (error) {
    redirectWithError(`/warehouses/${id}/edit`, getErrorMessage(error));
  }

  redirect("/warehouses");
}

export async function deleteWarehouse(id: number): Promise<void> {
  try {
    await prisma.warehouse.delete({ where: { id } });
  } catch (error) {
    redirectWithError("/warehouses", getErrorMessage(error));
  }

  redirect("/warehouses");
}
