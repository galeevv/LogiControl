import type { ShipmentStatus, SupplyStatus, VehicleStatus } from "@/generated/prisma/client";

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: "свободен",
  IN_TRANSIT: "в рейсе",
  MAINTENANCE: "на обслуживании",
};

export const supplyStatusLabels: Record<SupplyStatus, string> = {
  PLANNED: "запланирована",
  IN_TRANSIT: "в пути",
  RECEIVED: "получена",
  CANCELLED: "отменена",
};

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  PLANNED: "запланирована",
  IN_TRANSIT: "в пути",
  DELIVERED: "доставлена",
  CANCELLED: "отменена",
};

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU").format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}
