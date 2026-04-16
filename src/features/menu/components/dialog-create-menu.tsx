import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Preview } from "@/types/general";
import FormMenu from "./form-menu";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateMenu } from "../hooks/use-create-menu";
import { createMenuSchema, type CreateMenuForm } from "../validations";
import { INITIAL_CREATE_MENU_FORM } from "../constants";
import { z } from "zod";

interface DialogCreateMenuProps {
  onOpenChange: (open: boolean) => void;
}

export default function DialogCreateMenu({
  onOpenChange,
}: DialogCreateMenuProps) {
  const [preview, setPreview] = useState<Preview | undefined>(undefined);
  const { mutate, isPending } = useCreateMenu();

  const form = useForm<z.input<typeof createMenuSchema>, any, CreateMenuForm>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: INITIAL_CREATE_MENU_FORM,
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(
      {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        category: data.category,
        is_available: data.is_available,
        imageFile: preview?.file ?? null,
      },
      {
        onSuccess: () => {
          form.reset();
          setPreview(undefined);
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Tambah Menu</DialogTitle>
        <DialogDescription>Tambahkan menu baru ke daftar.</DialogDescription>
      </DialogHeader>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Create"
        preview={preview}
        setPreview={setPreview}
      />
    </DialogContent>
  );
}
