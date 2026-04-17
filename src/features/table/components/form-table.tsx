import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import FormInput from "@/features/user/components/form-input";
import FormSelect from "@/features/user/components/form-select";
import type { FormEvent } from "react";
import { STATUS_TABLE_LIST } from "../constant";

export default function FormTable<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T, any, any>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
}) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          form={form}
          name={"name" as Path<T>}
          label="Nama Meja"
          placeholder="Masukkan nama meja (cth. Meja 01)"
        />
        <FormSelect
          form={form}
          name={"status" as Path<T>}
          label="Status"
          selectItem={STATUS_TABLE_LIST}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {type}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
