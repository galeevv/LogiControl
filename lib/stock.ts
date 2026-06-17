import { Prisma, ShipmentStatus, SupplyStatus } from "@/generated/prisma/client";

type StockDelta = {
  warehouseId: number;
  productId: number;
  delta: number;
};

export type SupplyInput = {
  supplierId: number;
  warehouseId: number;
  productId: number;
  quantity: number;
  supplyDate: Date;
  status: SupplyStatus;
};

export type ShipmentInput = {
  customerId: number;
  warehouseId: number;
  productId: number;
  vehicleId: number;
  quantity: number;
  shipmentDate: Date;
  status: ShipmentStatus;
};

type SupplyEffect = Pick<SupplyInput, "warehouseId" | "productId" | "quantity" | "status">;
type ShipmentEffect = Pick<ShipmentInput, "warehouseId" | "productId" | "quantity" | "status">;

function supplyDelta(supply: SupplyEffect, multiplier: 1 | -1): StockDelta | null {
  if (supply.status !== "RECEIVED") {
    return null;
  }

  return {
    warehouseId: supply.warehouseId,
    productId: supply.productId,
    delta: supply.quantity * multiplier,
  };
}

function shipmentDelta(shipment: ShipmentEffect, multiplier: 1 | -1): StockDelta | null {
  if (shipment.status !== "DELIVERED") {
    return null;
  }

  return {
    warehouseId: shipment.warehouseId,
    productId: shipment.productId,
    delta: shipment.quantity * multiplier * -1,
  };
}

function combineDeltas(deltas: Array<StockDelta | null>): StockDelta[] {
  const groupedDeltas = new Map<string, StockDelta>();

  for (const delta of deltas) {
    if (!delta || delta.delta === 0) {
      continue;
    }

    const key = `${delta.warehouseId}:${delta.productId}`;
    const currentDelta = groupedDeltas.get(key);

    if (currentDelta) {
      currentDelta.delta += delta.delta;
    } else {
      groupedDeltas.set(key, { ...delta });
    }
  }

  return Array.from(groupedDeltas.values()).filter((delta) => delta.delta !== 0);
}

async function applyStockDelta(tx: Prisma.TransactionClient, delta: StockDelta): Promise<void> {
  if (delta.delta > 0) {
    await tx.stock.upsert({
      where: {
        warehouseId_productId: {
          warehouseId: delta.warehouseId,
          productId: delta.productId,
        },
      },
      create: {
        warehouseId: delta.warehouseId,
        productId: delta.productId,
        quantity: delta.delta,
      },
      update: {
        quantity: {
          increment: delta.delta,
        },
      },
    });

    return;
  }

  const decrement = Math.abs(delta.delta);
  const stock = await tx.stock.findUnique({
    where: {
      warehouseId_productId: {
        warehouseId: delta.warehouseId,
        productId: delta.productId,
      },
    },
  });

  if (!stock || stock.quantity < decrement) {
    throw new Error("Недостаточно остатка продукции на выбранном складе.");
  }

  await tx.stock.update({
    where: { id: stock.id },
    data: {
      quantity: {
        decrement,
      },
    },
  });
}

async function applyStockDeltas(tx: Prisma.TransactionClient, deltas: StockDelta[]): Promise<void> {
  for (const delta of deltas) {
    await applyStockDelta(tx, delta);
  }
}

export async function createSupplyWithStock(tx: Prisma.TransactionClient, data: SupplyInput) {
  await applyStockDeltas(tx, combineDeltas([supplyDelta(data, 1)]));
  return tx.supply.create({ data });
}

export async function updateSupplyWithStock(tx: Prisma.TransactionClient, id: number, data: SupplyInput) {
  const previousSupply = await tx.supply.findUnique({ where: { id } });

  if (!previousSupply) {
    throw new Error("Поставка не найдена.");
  }

  await applyStockDeltas(
    tx,
    combineDeltas([supplyDelta(previousSupply, -1), supplyDelta(data, 1)]),
  );

  return tx.supply.update({
    where: { id },
    data,
  });
}

export async function deleteSupplyWithStock(tx: Prisma.TransactionClient, id: number): Promise<void> {
  const previousSupply = await tx.supply.findUnique({ where: { id } });

  if (!previousSupply) {
    throw new Error("Поставка не найдена.");
  }

  await applyStockDeltas(tx, combineDeltas([supplyDelta(previousSupply, -1)]));
  await tx.supply.delete({ where: { id } });
}

export async function createShipmentWithStock(tx: Prisma.TransactionClient, data: ShipmentInput) {
  await applyStockDeltas(tx, combineDeltas([shipmentDelta(data, 1)]));
  return tx.shipment.create({ data });
}

export async function updateShipmentWithStock(tx: Prisma.TransactionClient, id: number, data: ShipmentInput) {
  const previousShipment = await tx.shipment.findUnique({ where: { id } });

  if (!previousShipment) {
    throw new Error("Отгрузка не найдена.");
  }

  await applyStockDeltas(
    tx,
    combineDeltas([shipmentDelta(previousShipment, -1), shipmentDelta(data, 1)]),
  );

  return tx.shipment.update({
    where: { id },
    data,
  });
}

export async function deleteShipmentWithStock(tx: Prisma.TransactionClient, id: number): Promise<void> {
  const previousShipment = await tx.shipment.findUnique({ where: { id } });

  if (!previousShipment) {
    throw new Error("Отгрузка не найдена.");
  }

  await applyStockDeltas(tx, combineDeltas([shipmentDelta(previousShipment, -1)]));
  await tx.shipment.delete({ where: { id } });
}
