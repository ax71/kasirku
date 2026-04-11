import { INITIAL_CREATE_USER_FORM } from "@/constants/auth-constant";
import {
  createUserSchema,
  type CreateUserForm,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Preview } from "@/types/general";
import { createUser } from "../services/user-service";
import FormUser from "./form-user";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogCreateUserProps {
  refetch: () => void;
  onOpenChange: (open: boolean) => void;
}

export default function DialogCreateUser({
  refetch,
  onOpenChange,
}: DialogCreateUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "avatar_url" && preview?.file) {
          formData.append(key, preview.file);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      const result = await createUser(formData);

      if (result.status === "success") {
        toast.success("Create User Success");
        form.reset();
        setPreview(undefined);
        onOpenChange(false);
        refetch();
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, messages]) => {
            const msgArray = messages as string[];
            form.setError(key as keyof CreateUserForm, {
              type: "server",
              message: msgArray[0],
            });
          });
        }
        toast.error(result.message || "Create User Failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create User</DialogTitle>
        <DialogDescription>Register a new user here</DialogDescription>
      </DialogHeader>
      <FormUser
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        type="Create"
        preview={preview}
        setPreview={setPreview}
      />
    </DialogContent>
  );
}
