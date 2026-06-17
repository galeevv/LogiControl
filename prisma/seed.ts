import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, ShipmentStatus, SupplyStatus, VehicleStatus } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.shipment.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      login: "admin",
      password: passwordHash,
      role: "admin",
    },
  });

  const steel = await prisma.product.create({
    data: {
      name: "Листовая сталь",
      article: "ST-001",
      unit: "кг",
      description: "Металл для производственных участков.",
    },
  });

  const bearings = await prisma.product.create({
    data: {
      name: "Подшипники",
      article: "BR-120",
      unit: "шт",
      description: "Комплектующие для сборочной линии.",
    },
  });

  const packaging = await prisma.product.create({
    data: {
      name: "Упаковочные коробки",
      article: "PK-010",
      unit: "шт",
      description: "Тара для готовой продукции.",
    },
  });

  const rawWarehouse = await prisma.warehouse.create({
    data: {
      name: "Склад сырья",
      address: "г. Екатеринбург, ул. Заводская, 12",
      capacity: 12000,
      manager: "Иванов Сергей",
    },
  });

  const finishedWarehouse = await prisma.warehouse.create({
    data: {
      name: "Склад готовой продукции",
      address: "г. Екатеринбург, ул. Производственная, 4",
      capacity: 8500,
      manager: "Петрова Анна",
    },
  });

  const supplierMetal = await prisma.supplier.create({
    data: {
      organization: "ООО МеталлСнаб",
      contactPerson: "Смирнов Андрей",
      phone: "+7 (343) 200-10-11",
      email: "supply@metallsnab.ru",
      address: "г. Челябинск, ул. Промышленная, 7",
    },
  });

  const supplierParts = await prisma.supplier.create({
    data: {
      organization: "АО КомплектПром",
      contactPerson: "Орлова Марина",
      phone: "+7 (343) 255-44-18",
      email: "info@komplektprom.ru",
      address: "г. Пермь, ул. Логистическая, 21",
    },
  });

  const customerUral = await prisma.customer.create({
    data: {
      organization: "ООО УралМашСервис",
      contactPerson: "Кузнецов Павел",
      phone: "+7 (343) 310-22-40",
      email: "orders@uralmash-service.ru",
      address: "г. Екатеринбург, ул. Машиностроителей, 9",
    },
  });

  const customerKazan = await prisma.customer.create({
    data: {
      organization: "ЗАО КазаньТех",
      contactPerson: "Ахметова Лилия",
      phone: "+7 (843) 500-12-55",
      email: "logistic@kazantech.ru",
      address: "г. Казань, ул. Индустриальная, 15",
    },
  });

  const vehicleOne = await prisma.vehicle.create({
    data: {
      brand: "КАМАЗ 5320",
      licensePlate: "А123ВС 196",
      loadCapacity: 8000,
      driver: "Николаев Дмитрий",
      status: VehicleStatus.AVAILABLE,
    },
  });

  const vehicleTwo = await prisma.vehicle.create({
    data: {
      brand: "ГАЗон Next",
      licensePlate: "М456КТ 196",
      loadCapacity: 4500,
      driver: "Федоров Илья",
      status: VehicleStatus.IN_TRANSIT,
    },
  });

  await prisma.supply.createMany({
    data: [
      {
        supplierId: supplierMetal.id,
        warehouseId: rawWarehouse.id,
        productId: steel.id,
        quantity: 800,
        supplyDate: new Date("2026-04-18T00:00:00"),
        status: SupplyStatus.RECEIVED,
      },
      {
        supplierId: supplierParts.id,
        warehouseId: rawWarehouse.id,
        productId: bearings.id,
        quantity: 300,
        supplyDate: new Date("2026-04-20T00:00:00"),
        status: SupplyStatus.RECEIVED,
      },
      {
        supplierId: supplierParts.id,
        warehouseId: finishedWarehouse.id,
        productId: packaging.id,
        quantity: 1200,
        supplyDate: new Date("2026-04-28T00:00:00"),
        status: SupplyStatus.IN_TRANSIT,
      },
    ],
  });

  await prisma.shipment.createMany({
    data: [
      {
        customerId: customerUral.id,
        warehouseId: rawWarehouse.id,
        productId: steel.id,
        vehicleId: vehicleOne.id,
        quantity: 150,
        shipmentDate: new Date("2026-04-21T00:00:00"),
        status: ShipmentStatus.DELIVERED,
      },
      {
        customerId: customerKazan.id,
        warehouseId: rawWarehouse.id,
        productId: bearings.id,
        vehicleId: vehicleTwo.id,
        quantity: 60,
        shipmentDate: new Date("2026-04-25T00:00:00"),
        status: ShipmentStatus.IN_TRANSIT,
      },
      {
        customerId: customerUral.id,
        warehouseId: finishedWarehouse.id,
        productId: packaging.id,
        vehicleId: vehicleOne.id,
        quantity: 200,
        shipmentDate: new Date("2026-04-29T00:00:00"),
        status: ShipmentStatus.PLANNED,
      },
    ],
  });

  await prisma.stock.createMany({
    data: [
      {
        warehouseId: rawWarehouse.id,
        productId: steel.id,
        quantity: 650,
      },
      {
        warehouseId: rawWarehouse.id,
        productId: bearings.id,
        quantity: 300,
      },
      {
        warehouseId: finishedWarehouse.id,
        productId: packaging.id,
        quantity: 500,
      },
    ],
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
