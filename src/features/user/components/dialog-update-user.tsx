import {
  updateUserSchema,
  type UpdateUserForm,
} from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Profile } from "@/features/auth/types";
import FormUser from "./form-user";
import { useEffect, useState } from "react";
import type { Preview } from "@/types/general";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUser } from "../hooks/use-update-user";

interface DialogUpdateUserProps {
  currentData?: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogUpdateUser({
  currentData,
  open,
  onOpenChange,
}: DialogUpdateUserProps) {
  const [preview, setPreview] = useState<Preview | undefined>(undefined);
  const { mutate, isPending } = useUpdateUser();

  useEffect(() => {
    if (currentData?.avatar_url) {
      setPreview({
        file: null as unknown as File,
        displayUrl: currentData.avatar_url,
      });
    } else {
      setPreview(undefined);
    }
  }, [currentData]);

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    values: {
      name: currentData?.name || "",
      role: currentData?.role || "",
      avatar_url: currentData?.avatar_url || "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!currentData?.id) return;

    mutate(
      {
        id: currentData.id,
        name: data.name,
        role: data.role,
        avatarFile: preview?.file ?? null,
        oldAvatarUrl: currentData.avatar_url ?? undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update User</DialogTitle>
        <DialogDescription>
          Make changes to the user profile here.
        </DialogDescription>
      </DialogHeader>

      <FormUser
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

