import supabase from "@/lib/supabase";
import type { TableItem } from "../table-validations";
import type { Database } from "@/types/database";

export interface GetTablesParams {
  page: number;
  limit: number;
  search: string;
  status?: string;
}

export interface GetTablesResult {
  data: TableItem[];
  count: number;
}

export interface CreateTableInput {
  name: string;
  status: string;
}

export interface UpdateTableInput {
  id: number;
  name: string;
  status: string;
}

export async function getTables(params: GetTablesParams): Promise<GetTablesResult> {
  const { page, limit, search, status } = params;

  let query = (supabase.from("tables") as any)
    .select("*", { count: "exact" })
    .range((page - 1) * limit, page * limit - 1)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data as any as TableItem[]) ?? [],
    count: count ?? 0,
  };
}

export async function createTable(input: CreateTableInput): Promise<void> {
  const { error } = await (supabase.from("tables") as any).insert({
    name: input.name,
    status: input.status,
  } as Database["public"]["Tables"]["tables"]["Insert"]);

  if (error) throw error;
}

export async function updateTable(input: UpdateTableInput): Promise<void> {
  const { error } = await (supabase.from("tables") as any)
    .update({
      name: input.name,
      status: input.status,
      updated_at: new Date().toISOString(),
    } as Database["public"]["Tables"]["tables"]["Update"])
    .eq("id", input.id);

  if (error) throw error;
}

export async function deleteTable(id: number): Promise<void> {
  const { error } = await (supabase.from("tables") as any)
    .delete()
    .eq("id", id);

  if (error) throw error;
}
