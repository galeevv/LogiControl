"use server";

import { redirect } from "next/navigation";
import { getErrorMessage, getRequiredString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";

function readSupplierData(formData: FormData) {
  return {
    organization: getRequiredString(formData, "organization"),
    contactPerson: getRequiredString(formData, "contactPerson"),
    phone: getRequiredString(formData, "phone"),
    email: getRequiredString(formData, "email"),
    address: getRequiredString(formData, "address"),
  };
}

export async function createSupplier(formData: FormData): Promise<void> {
  try {
    await prisma.supplier.create({ data: readSupplierData(formData) });
  } catch (error) {
    redirectWithError("/suppliers/new", getErrorMessage(error));
  }

  redirect("/suppliers");
}

export async function updateSupplier(id: number, formData: FormData): Promise<void> {
  try {
    await prisma.supplier.update({
      where: { id },
      data: readSupplierData(formData),
    });
  } catch (error) {
    redirectWithError(`/suppliers/${id}/edit`, getErrorMessage(error));
  }

  redirect("/suppliers");
}

export async function deleteSupplier(id: number): Promise<void> {
  try {
    await prisma.supplier.delete({ where: { id } });
  } catch (error) {
    redirectWithError("/suppliers", getErrorMessage(error));
  }

  redirect("/suppliers");
}
