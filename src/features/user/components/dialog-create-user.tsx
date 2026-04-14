import { INITIAL_CREATE_USER_FORM } from "@/features/auth/constants";
import {
  createUserSchema,
  type CreateUserForm,
} from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Preview } from "@/types/general";
import FormUser from "./form-user";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateUser } from "../hooks/use-create-user";

interface DialogCreateUserProps {
  onOpenChange: (open: boolean) => void;
}

export default function DialogCreateUser({
  onOpenChange,
}: DialogCreateUserProps) {
  const [preview, setPreview] = useState<Preview | undefined>(undefined);
  const { mutate, isPending } = useCreateUser();

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        avatarFile: preview?.file ?? null,
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create User</DialogTitle>
        <DialogDescription>Register a new user here</DialogDescription>
      </DialogHeader>
      <FormUser
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
