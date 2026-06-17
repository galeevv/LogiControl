"use server";

import { redirect } from "next/navigation";
import { getErrorMessage, getRequiredString, getString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";

function readProductData(formData: FormData) {
  const description = getString(formData, "description");

  return {
    name: getRequiredString(formData, "name"),
    article: getRequiredString(formData, "article"),
    unit: getRequiredString(formData, "unit"),
    description: description || null,
  };
}

export async function createProduct(formData: FormData): Promise<void> {
  try {
    await prisma.product.create({ data: readProductData(formData) });
  } catch (error) {
    redirectWithError("/products/new", getErrorMessage(error));
  }

  redirect("/products");
}

export async function updateProduct(id: number, formData: FormData): Promise<void> {
  try {
    await prisma.product.update({
      where: { id },
      data: readProductData(formData),
    });
  } catch (error) {
    redirectWithError(`/products/${id}/edit`, getErrorMessage(error));
  }

  redirect("/products");
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    redirectWithError("/products", getErrorMessage(error));
  }

  redirect("/products");
}
