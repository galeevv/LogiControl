import { VehicleStatus } from "@/generated/prisma/client";
import { notFound } from "next/navigation";
import { Card, ErrorNotice, FormActions, FormField, PageHeader, SelectField } from "@/components/ui";
import { vehicleStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { updateVehicle } from "@/app/(protected)/vehicles/actions";

type EditVehiclePageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
};

const statusOptions = Object.values(VehicleStatus).map((status) => ({
  value: status,
  label: vehicleStatusLabels[status],
}));

export default async function EditVehiclePage({ params, searchParams }: EditVehiclePageProps) {
  const { id } = await params;
  const vehicleId = Number(id);

  if (!Number.isInteger(vehicleId)) {
    notFound();
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Редактирование транспорта" description="Изменение данных транспортного средства." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={updateVehicle.bind(null, vehicle.id)} className="grid gap-4">
          <FormField label="Марка" name="brand" defaultValue={vehicle.brand} />
          <FormField label="Государственный номер" name="licensePlate" defaultValue={vehicle.licensePlate} />
          <FormField label="Грузоподъемность, кг" name="loadCapacity" type="number" defaultValue={vehicle.loadCapacity} />
          <FormField label="Водитель" name="driver" defaultValue={vehicle.driver} />
          <SelectField label="Статус" name="status" options={statusOptions} defaultValue={vehicle.status} />
          <FormActions cancelHref="/vehicles" />
        </form>
      </Card>
    </>
  );
}
