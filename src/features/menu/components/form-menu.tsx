import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import type { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import FormInput from "@/features/user/components/form-input";
import FormSelect from "@/features/user/components/form-select";
import FormImage from "@/features/user/components/form-image";
import type { FormEvent } from "react";
import { CATEGORY_LIST } from "../constants";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export default function FormMenu<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T, any, any>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview | undefined) => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          form={form}
          name={"name" as Path<T>}
          label="Nama Menu"
          placeholder="Masukkan nama menu"
        />
        <FormInput
          form={form}
          name={"description" as Path<T>}
          label="Deskripsi"
          placeholder="Masukkan deskripsi menu"
        />
        <FormInput
          form={form}
          name={"price" as Path<T>}
          type="number"
          label="Harga (Rp)"
          placeholder="15000"
        />
        <FormInput
          form={form}
          name={"discount" as Path<T>}
          type="number"
          label="Diskon (%)"
          placeholder="0"
        />
        <FormSelect
          form={form}
          name={"category" as Path<T>}
          label="Kategori"
          selectItem={CATEGORY_LIST}
        />
        <FormImage
          form={form}
          name={"image" as Path<T>}
          label="Gambar Menu"
          preview={preview}
          setPreview={setPreview}
        />
        <FormField
          control={form.control as any}
          name={"is_available" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Ketersediaan</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Tandai menu ini sebagai tersedia untuk dijual
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            {type}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
