import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TableItem } from "../table-validations";
import FormTable from "./form-table";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateTable } from "../hooks/use-update-table";
import { tableFormSchema, type TableForm } from "../table-validations";
import { z } from "zod";

interface DialogUpdateTableProps {
  currentData?: TableItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogUpdateTable({
  currentData,
  onOpenChange,
}: DialogUpdateTableProps) {
  const { mutate, isPending } = useUpdateTable();

  const form = useForm<z.input<typeof tableFormSchema>, any, TableForm>({
    resolver: zodResolver(tableFormSchema),
    values: {
      name: currentData?.name || "",
      status: currentData?.status || "available",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!currentData?.id) return;

    mutate(
      {
        id: currentData.id,
        name: data.name,
        status: data.status,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Edit Meja</DialogTitle>
        <DialogDescription>
          Ubah detail meja <strong>{currentData?.name}</strong>.
        </DialogDescription>
      </DialogHeader>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Update"
      />
    </DialogContent>
  );
}
