import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Preview } from "@/types/general";
import type { MenuItem } from "../types";
import FormMenu from "./form-menu";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateMenu } from "../hooks/use-update-menu";
import { updateMenuSchema, type UpdateMenuForm } from "../validations";
import { z } from "zod";

interface DialogUpdateMenuProps {
  currentData?: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogUpdateMenu({
  currentData,
  onOpenChange,
}: DialogUpdateMenuProps) {
  const { mutate, isPending } = useUpdateMenu();
  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  useEffect(() => {
    if (currentData?.image_url) {
      setPreview({
        file: null as unknown as File,
        displayUrl: currentData.image_url,
      });
    } else {
      setPreview(undefined);
    }
  }, [currentData]);

  const form = useForm<z.input<typeof updateMenuSchema>, any, UpdateMenuForm>({
    resolver: zodResolver(updateMenuSchema),
    values: {
      name: currentData?.name || "",
      description: currentData?.description || "",
      price: currentData?.price || 0,
      discount: currentData?.discount || 0,
      category: currentData?.category || "",
      is_available: currentData?.is_available ?? true,
      image: currentData?.image_url || null,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!currentData?.id) return;

    mutate(
      {
        id: currentData.id,
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        category: data.category,
        is_available: data.is_available,
        imageFile: preview?.file ?? null,
        oldImageUrl: currentData.image_url ?? undefined,
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
        <DialogTitle>Edit Menu</DialogTitle>
        <DialogDescription>
          Ubah detail menu <strong>{currentData?.name}</strong>.
        </DialogDescription>
      </DialogHeader>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </DialogContent>
  );
}
