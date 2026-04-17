import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormTable from "./form-table";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTable } from "../hooks/use-create-table";
import { tableFormSchema, type TableForm, INITIAL_TABLE_FORM } from "../table-validations";
import { z } from "zod";

interface DialogCreateTableProps {
  onOpenChange: (open: boolean) => void;
}

export default function DialogCreateTable({
  onOpenChange,
}: DialogCreateTableProps) {
  const { mutate, isPending } = useCreateTable();

  const form = useForm<z.input<typeof tableFormSchema>, any, TableForm>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: INITIAL_TABLE_FORM,
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(
      {
        name: data.name,
        status: data.status,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Tambah Meja</DialogTitle>
        <DialogDescription>Tambahkan meja baru ke daftar.</DialogDescription>
      </DialogHeader>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Create"
      />
    </DialogContent>
  );
}
