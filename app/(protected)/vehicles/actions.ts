"use server";

import { VehicleStatus } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { getErrorMessage, getRequiredInt, getRequiredString } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { redirectWithError } from "@/lib/redirect";

function readVehicleStatus(formData: FormData): VehicleStatus {
  const status = getRequiredString(formData, "status");

  if (Object.values(VehicleStatus).includes(status as VehicleStatus)) {
    return status as VehicleStatus;
  }

  throw new Error("Укажите корректный статус транспорта.");
}

function readVehicleData(formData: FormData) {
  return {
    brand: getRequiredString(formData, "brand"),
    licensePlate: getRequiredString(formData, "licensePlate"),
    loadCapacity: getRequiredInt(formData, "loadCapacity"),
    driver: getRequiredString(formData, "driver"),
    status: readVehicleStatus(formData),
  };
}

export async function createVehicle(formData: FormData): Promise<void> {
  try {
    await prisma.vehicle.create({ data: readVehicleData(formData) });
  } catch (error) {
    redirectWithError("/vehicles/new", getErrorMessage(error));
  }

  redirect("/vehicles");
}

export async function updateVehicle(id: number, formData: FormData): Promise<void> {
  try {
    await prisma.vehicle.update({
      where: { id },
      data: readVehicleData(formData),
    });
  } catch (error) {
    redirectWithError(`/vehicles/${id}/edit`, getErrorMessage(error));
  }

  redirect("/vehicles");
}

export async function deleteVehicle(id: number): Promise<void> {
  try {
    await prisma.vehicle.delete({ where: { id } });
  } catch (error) {
    redirectWithError("/vehicles", getErrorMessage(error));
  }

  redirect("/vehicles");
}
