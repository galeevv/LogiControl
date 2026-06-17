"use server";

import { ShipmentStatus } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { getErrorMessage, getRequiredDate, getRequiredInt, getRequiredString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";
import {
  createShipmentWithStock,
  deleteShipmentWithStock,
  updateShipmentWithStock,
  type ShipmentInput,
} from "@/lib/stock";

function readShipmentStatus(formData: FormData): ShipmentStatus {
  const status = getRequiredString(formData, "status");

  if (Object.values(ShipmentStatus).includes(status as ShipmentStatus)) {
    return status as ShipmentStatus;
  }

  throw new Error("Укажите корректный статус отгрузки.");
}

function readShipmentData(formData: FormData): ShipmentInput {
  return {
    customerId: getRequiredInt(formData, "customerId"),
    warehouseId: getRequiredInt(formData, "warehouseId"),
    productId: getRequiredInt(formData, "productId"),
    vehicleId: getRequiredInt(formData, "vehicleId"),
    quantity: getRequiredInt(formData, "quantity"),
    shipmentDate: getRequiredDate(formData, "shipmentDate"),
    status: readShipmentStatus(formData),
  };
}

export async function createShipment(formData: FormData): Promise<void> {
  try {
    await prisma.$transaction((tx) => createShipmentWithStock(tx, readShipmentData(formData)));
  } catch (error) {
    redirectWithError("/shipments/new", getErrorMessage(error));
  }

  redirect("/shipments");
}

export async function updateShipment(id: number, formData: FormData): Promise<void> {
  try {
    await prisma.$transaction((tx) => updateShipmentWithStock(tx, id, readShipmentData(formData)));
  } catch (error) {
    redirectWithError(`/shipments/${id}/edit`, getErrorMessage(error));
  }

  redirect("/shipments");
}

export async function deleteShipment(id: number): Promise<void> {
  try {
    await prisma.$transaction((tx) => deleteShipmentWithStock(tx, id));
  } catch (error) {
    redirectWithError("/shipments", getErrorMessage(error));
  }

  redirect("/shipments");
}
