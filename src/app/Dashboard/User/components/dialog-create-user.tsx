import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
} from "@/constants/auth-constant";
import {
  createUserSchema,
  type CreateUserForm,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { AuthFormState } from "@/types/auth";
import type { Preview } from "@/types/general";
import { createUser } from "../services/user-service";
import FormUser from "./form-user";

export default function DialogCreateUser({ refetch }: { refetch: () => void }) {
  const [state, setState] = useState<AuthFormState>(INITIAL_STATE_CREATE_USER);
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
        if (key === "avatar_url") {
          if (preview?.file) {
            formData.append(key, preview.file);
          }
        } else {
          formData.append(key, value as string);
        }
      });

      const result = await createUser(state, formData);
      setState(result);

      if (result.status === "success") {
        toast.success("Create User Success");
        form.reset();
        setPreview(undefined);
        const closeButton = document.querySelector<HTMLButtonElement>(
          '[data-state="open"]',
        );
        if (closeButton) closeButton.click();

        refetch();
      } else if (result.status === "error") {
        toast.error("Create user Failed", {
          description: result.errors?._form?.[0] || "Check your input",
        });

        if (result.errors) {
          Object.entries(result.errors).forEach(([key, messages]) => {
            if (key !== "_form" && messages && messages.length > 0) {
              form.setError(key as keyof CreateUserForm, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
