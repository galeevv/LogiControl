import { VehicleStatus } from "@/generated/prisma/client";
import { Card, ErrorNotice, FormActions, FormField, PageHeader, SelectField } from "@/components/ui";
import { vehicleStatusLabels } from "@/lib/format";
import { getErrorParam, type SearchParams } from "@/lib/forms";
import { createVehicle } from "@/app/(protected)/vehicles/actions";

type NewVehiclePageProps = {
  searchParams?: Promise<SearchParams>;
};

const statusOptions = Object.values(VehicleStatus).map((status) => ({
  value: status,
  label: vehicleStatusLabels[status],
}));

export default async function NewVehiclePage({ searchParams }: NewVehiclePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageHeader title="Новый транспорт" description="Добавление транспортного средства." />
      <ErrorNotice message={getErrorParam(resolvedSearchParams)} />

      <Card className="p-6">
        <form action={createVehicle} className="grid gap-4">
          <FormField label="Марка" name="brand" />
          <FormField label="Государственный номер" name="licensePlate" />
          <FormField label="Грузоподъемность, кг" name="loadCapacity" type="number" />
          <FormField label="Водитель" name="driver" />
          <SelectField label="Статус" name="status" options={statusOptions} defaultValue={VehicleStatus.AVAILABLE} />
          <FormActions cancelHref="/vehicles" />
        </form>
      </Card>
    </>
  );
}
