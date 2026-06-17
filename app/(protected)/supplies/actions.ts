"use server";

import { SupplyStatus } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { getErrorMessage, getRequiredDate, getRequiredInt, getRequiredString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";
import { createSupplyWithStock, deleteSupplyWithStock, updateSupplyWithStock, type SupplyInput } from "@/lib/stock";

function readSupplyStatus(formData: FormData): SupplyStatus {
  const status = getRequiredString(formData, "status");

  if (Object.values(SupplyStatus).includes(status as SupplyStatus)) {
    return status as SupplyStatus;
  }

  throw new Error("Укажите корректный статус поставки.");
}

function readSupplyData(formData: FormData): SupplyInput {
  return {
    supplierId: getRequiredInt(formData, "supplierId"),
    warehouseId: getRequiredInt(formData, "warehouseId"),
    productId: getRequiredInt(formData, "productId"),
    quantity: getRequiredInt(formData, "quantity"),
    supplyDate: getRequiredDate(formData, "supplyDate"),
    status: readSupplyStatus(formData),
  };
}

export async function createSupply(formData: FormData): Promise<void> {
  try {
    await prisma.$transaction((tx) => createSupplyWithStock(tx, readSupplyData(formData)));
  } catch (error) {
    redirectWithError("/supplies/new", getErrorMessage(error));
  }

  redirect("/supplies");
}

export async function updateSupply(id: number, formData: FormData): Promise<void> {
  try {
    await prisma.$transaction((tx) => updateSupplyWithStock(tx, id, readSupplyData(formData)));
  } catch (error) {
    redirectWithError(`/supplies/${id}/edit`, getErrorMessage(error));
  }

  redirect("/supplies");
}

export async function deleteSupply(id: number): Promise<void> {
  try {
    await prisma.$transaction((tx) => deleteSupplyWithStock(tx, id));
  } catch (error) {
    redirectWithError("/supplies", getErrorMessage(error));
  }

  redirect("/supplies");
}
