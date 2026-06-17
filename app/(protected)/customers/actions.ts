"use server";

import { redirect } from "next/navigation";
import { getErrorMessage, getRequiredString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";

function readCustomerData(formData: FormData) {
  return {
    organization: getRequiredString(formData, "organization"),
    contactPerson: getRequiredString(formData, "contactPerson"),
    phone: getRequiredString(formData, "phone"),
    email: getRequiredString(formData, "email"),
    address: getRequiredString(formData, "address"),
  };
}

export async function createCustomer(formData: FormData): Promise<void> {
  try {
    await prisma.customer.create({ data: readCustomerData(formData) });
  } catch (error) {
    redirectWithError("/customers/new", getErrorMessage(error));
  }

  redirect("/customers");
}

export async function updateCustomer(id: number, formData: FormData): Promise<void> {
  try {
    await prisma.customer.update({
      where: { id },
      data: readCustomerData(formData),
    });
  } catch (error) {
    redirectWithError(`/customers/${id}/edit`, getErrorMessage(error));
  }

  redirect("/customers");
}

export async function deleteCustomer(id: number): Promise<void> {
  try {
    await prisma.customer.delete({ where: { id } });
  } catch (error) {
    redirectWithError("/customers", getErrorMessage(error));
  }

  redirect("/customers");
}
