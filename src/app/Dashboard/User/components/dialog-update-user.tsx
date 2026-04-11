import {
  updateUserSchema,
  type UpdateUserForm,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Profile } from "@/types/auth";
import FormUser from "./form-user";
import { useEffect, useState } from "react";
import type { Preview } from "@/types/general";
import { updateUser } from "../services/user-service";
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogUpdateUserProps {
  refetch: () => void;
  currentData?: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogUpdateUser({
  refetch,
  currentData,
  open,
  onOpenChange,
}: DialogUpdateUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  useEffect(() => {
    if (currentData?.avatar_url) {
      setPreview({
        file: null as any,
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

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", currentData?.id || "");

      Object.entries(data).forEach(([key, value]) => {
        if (key === "avatar_url" && preview?.file) {
          formData.append(key, preview.file);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      if (currentData?.avatar_url !== data.avatar_url && preview?.file) {
        formData.append("old_avatar_url", currentData?.avatar_url || "");
      }

      await updateUser(formData);
      toast.success("Update User Success");
      refetch();
      onOpenChange(false);
    } catch (error) {
      toast.error("Update User Failed");
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </DialogContent>
  );
}
