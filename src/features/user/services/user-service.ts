import supabase from "@/lib/supabase";
import { uploadFile } from "./upload-file-service";
import { deleteFile } from "./delete-image-service";

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: string;
  avatarFile?: File | null;
}

export interface UpdateUserInput {
  id: string;
  name: string;
  role: string;
  avatarFile?: File | null;
  oldAvatarUrl?: string;
}

export interface DeleteUserInput {
  id: string;
  avatarUrl?: string;
}

export interface GetUsersParams {
  page: number;
  limit: number;
  search: string;
}

export interface GetUsersResult {
  data: Profile[];
  count: number;
}

interface Profile {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
}

export async function getUsers(
  params: GetUsersParams,
): Promise<GetUsersResult> {
  const { page, limit, search } = params;

  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .range((page - 1) * limit, page * limit - 1)
    .ilike("name", `%${search}%`);

  if (error) throw error;

  return {
    data: (data as unknown as Profile[]) ?? [],
    count: count ?? 0,
  };
}

export async function createUser(input: CreateUserInput): Promise<void> {
  let finalAvatarUrl = "";

  if (input.avatarFile && input.avatarFile.size > 0) {
    const uploadResult = await uploadFile("images", "users", input.avatarFile);
    if (uploadResult.status === "error") {
      throw new Error("Upload Image Failed");
    }
    finalAvatarUrl = uploadResult.data?.url || "";
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: input.role,
        avatar_url: finalAvatarUrl,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("User Create Failed");
}

export async function updateUser(input: UpdateUserInput): Promise<void> {
  let finalAvatarUrl = input.oldAvatarUrl || "";

  if (input.avatarFile && input.avatarFile.size > 0) {
    const uploadResult = await uploadFile("images", "users", input.avatarFile);
    if (uploadResult.status === "error") {
      throw new Error("Upload Image Failed");
    }
    finalAvatarUrl = uploadResult.data?.url || "";

    // Clean up old avatar
    if (input.oldAvatarUrl) {
      await deleteFile(input.oldAvatarUrl);
    }
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      name: input.name,
      role: input.role,
      avatar_url: finalAvatarUrl,
    },
  });

  if (authError) throw authError;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: input.name,
      role: input.role,
      avatar_url: finalAvatarUrl,
    })
    .eq("id", input.id);

  if (profileError) throw profileError;
}

export async function deleteUser(input: DeleteUserInput): Promise<void> {
  if (input.avatarUrl && !input.avatarUrl.includes("default-avatar")) {
    const deleteResult = await deleteFile(input.avatarUrl);
    if (deleteResult.status === "error") {
      throw new Error(deleteResult.message || "Delete Image Failed");
    }
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", input.id);

  if (dbError) throw dbError;
}
