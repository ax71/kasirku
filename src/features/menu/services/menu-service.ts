import supabase from "@/lib/supabase";
import type { MenuItem } from "../types";
import type { Database } from "@/types/database";

export interface CreateMenuInput {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  category: string;
  is_available: boolean;
  imageFile?: File | null;
}

export interface UpdateMenuInput {
  id: number;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  category: string;
  is_available: boolean;
  imageFile?: File | null;
  oldImageUrl?: string;
}

export interface DeleteMenuInput {
  id: number;
  imageUrl?: string;
}

export interface GetMenuParams {
  page: number;
  limit: number;
  search: string;
  category?: string;
}

export interface GetMenuResult {
  data: MenuItem[];
  count: number;
}

export async function getMenuItems(
  params: GetMenuParams,
): Promise<GetMenuResult> {
  const { page, limit, search, category } = params;

  let query = (supabase.from("menus") as any)
    .select("*", { count: "exact" })
    .range((page - 1) * limit, page * limit - 1)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data as any as MenuItem[]) ?? [],
    count: count ?? 0,
  };
}

export async function createMenu(input: CreateMenuInput): Promise<void> {
  let finalImageUrl = "";

  if (input.imageFile && input.imageFile.size > 0) {
    finalImageUrl = await uploadMenuImage(input.imageFile);
  }

  const { error } = await (supabase.from("menus") as any).insert({
    name: input.name,
    description: input.description || null,
    price: input.price,
    discount: input.discount || 0,
    category: input.category,
    is_available: input.is_available,
    image_url: finalImageUrl || null,
  } as Database["public"]["Tables"]["menus"]["Insert"]);

  if (error) throw error;
}

export async function updateMenu(input: UpdateMenuInput): Promise<void> {
  let finalImageUrl = input.oldImageUrl || "";

  if (input.imageFile && input.imageFile.size > 0) {
    finalImageUrl = await uploadMenuImage(input.imageFile);

    // Clean up old image
    if (input.oldImageUrl) {
      await deleteMenuImage(input.oldImageUrl);
    }
  }

  const { error } = await (supabase.from("menus") as any)
    .update({
      name: input.name,
      description: input.description || null,
      price: input.price,
      discount: input.discount || 0,
      category: input.category,
      is_available: input.is_available,
      image_url: finalImageUrl || null,
      updated_at: new Date().toISOString(),
    } as Database["public"]["Tables"]["menus"]["Update"])
    .eq("id", input.id);

  if (error) throw error;
}

export async function deleteMenu(input: DeleteMenuInput): Promise<void> {
  if (input.imageUrl) {
    await deleteMenuImage(input.imageUrl);
  }

  const { error } = await (supabase.from("menus") as any)
    .delete()
    .eq("id", input.id);

  if (error) throw error;
}

// ── Storage helpers ───────────────────────────────────────────────────

async function uploadMenuImage(file: File): Promise<string> {
  const path = `menu/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from("images").upload(path, file);

  if (error) throw new Error(`Upload Image Failed: ${error.message}`);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/images/${path}`;
}

async function deleteMenuImage(imageUrl: string): Promise<void> {
  // Extract path from full URL
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/images\/(.+)$/);
  if (!match) return;

  const path = match[1];
  await supabase.storage.from("images").remove([path]);
}
