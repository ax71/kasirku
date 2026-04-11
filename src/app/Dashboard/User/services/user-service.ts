import {
  createUserSchema,
  updateUserSchema,
} from "@/validations/auth-validation";
import supabase from "@/lib/supabase";
import { uploadFile } from "./upload-file-service";
import { deleteFile } from "./delete-image-service";

export async function createUser(formData: FormData) {
  const rowData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
  };
  const validatedFields = createUserSchema.safeParse(rowData);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  try {
    let finalAvatarUrl = "";
    const avatarFile = formData.get("avatar_url");

    if (avatarFile instanceof File && avatarFile.size > 0) {
      const uploadResult = await uploadFile("images", "users", avatarFile);

      if (uploadResult.status === "error") {
        throw new Error("Upload Image Failed");
      }

      finalAvatarUrl = uploadResult.data?.url || "";
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError) throw authError;
    if (!authData.user) throw new Error("User Create Failed");

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: validatedFields.data.email,
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      avatar_url: finalAvatarUrl,
    });

    if (profileError) throw profileError;

    return {
      status: "success",
    };
  } catch (error: any) {
    console.error("Create User Error:", error);
    return {
      status: "error",
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;

  // 1. Validasi Data dari FormData
  const rawData = {
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
  };

  const validatedFields = updateUserSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    let finalAvatarUrl = (formData.get("avatar_url") as string) || "";
    const avatarFile = formData.get("avatar_url");
    const oldAvatarUrl = formData.get("old_avatar_url") as string;

    // 2. Logika Upload File (Jika ada file baru)
    if (avatarFile instanceof File && avatarFile.size > 0) {
      const uploadResult = await uploadFile("images", "users", avatarFile);

      if (uploadResult.status === "error") {
        throw new Error("Upload Image Failed");
      }

      finalAvatarUrl = uploadResult.data?.url || "";

      if (oldAvatarUrl) await deleteFile(oldAvatarUrl);
    }

    // 3. Update User di Supabase
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: validatedFields.data.name,
        role: validatedFields.data.role,
        avatar_url: finalAvatarUrl,
      },
    });

    if (authError) throw authError;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        name: validatedFields.data.name,
        role: validatedFields.data.role,
        avatar_url: finalAvatarUrl,
      })
      .eq("id", id);

    if (profileError) throw profileError;

    return {
      status: "success",
      data: profile,
    };
  } catch (error: any) {
    console.error("Update User Error:", error);
    return {
      status: "error",
      message: error.message || "An unexpected error occurred",
    };
  }
}
