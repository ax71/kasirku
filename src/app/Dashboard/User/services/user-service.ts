import type { AuthFormState } from "@/types/auth";
import { createUserSchema } from "@/validations/auth-validation";
import supabase from "@/lib/supabase";
import { uploadFile } from "./upload-file-service";

export async function createUser(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  let finalAvatarUrl = "";

  const avatarFile = formData.get("avatar_url");

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const uploadResault = await uploadFile("images", "users", avatarFile);
    if (uploadResault.status === "error") {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: ["Upload Image Failed"],
        },
      };
    }
    finalAvatarUrl = uploadResault.data?.url || "";
  }

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        name: validatedFields.data.name,
        role: validatedFields.data.role,
        avatar_url: finalAvatarUrl,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
    errors: { _form: [] },
  };
}
