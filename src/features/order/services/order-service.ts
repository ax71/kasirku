import supabase from "@/lib/supabase";
import type {
  CartItemInsert,
  OrderMenuStatus,
  OrderRow,
  OrderStatus,
  TableRow,
} from "../types/order";

// ─── Query Functions ──────────────────────────────────────────────────────────

export interface OrderQueryParams {
  page: number;
  limit: number;
  search: string;
}

/**
 * Mengambil daftar orders dengan pagination dan pencarian.
 */
export async function getOrders(params: OrderQueryParams): Promise<{
  data: OrderRow[];
  count: number;
}> {
  const { page, limit, search } = params;

  const query = supabase
    .from("orders")
    .select(
      `id, order_id, customer_name, status, payment_token, tables(name, id)`,
      { count: "exact" },
    )
    .range((page - 1) * limit, page * limit - 1)
    .order("created_at");

  if (search) {
    query.or(
      `order_id.ilike.%${search}%,customer_name.ilike.%${search}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data as unknown as OrderRow[]) ?? [],
    count: count ?? 0,
  };
}

/**
 * Mengambil daftar meja untuk dropdown create order.
 */
export async function getAvailableTables(): Promise<TableRow[]> {
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .order("created_at")
    .order("status");

  if (error) throw new Error(error.message);

  return (data as TableRow[]) ?? [];
}

export interface CreateOrderDineInPayload {
  customer_name: string;
  table_id: string;
  status: OrderStatus;
}

export interface CreateOrderTakeawayPayload {
  customer_name: string;
}

/**
 * Membuat order baru (Dine In) dan mengupdate status meja menjadi "occupied".
 */
export async function createOrderDineIn(
  payload: CreateOrderDineInPayload,
): Promise<void> {
  const { customer_name, table_id, status } = payload;

  // Generate order ID — format: INV-<timestamp>
  const order_id = `INV-${Date.now()}`;

  const { error } = await supabase.from("orders").insert({
    customer_name,
    table_id: Number(table_id),
    status,
    order_id,
  });

  if (error) throw new Error(error.message);

  // Update status meja
  const { error: tableError } = await supabase
    .from("tables")
    .update({ status: "occupied" })
    .eq("id", Number(table_id));

  if (tableError) throw new Error(tableError.message);
}

/**
 * Membuat order baru (Takeaway) — tidak perlu meja.
 */
export async function createOrderTakeaway(
  payload: CreateOrderTakeawayPayload,
): Promise<void> {
  const { customer_name } = payload;
  const order_id = `INV-${Date.now()}`;

  const { error } = await supabase.from("orders").insert({
    customer_name,
    status: "process" as OrderStatus,
    order_id,
  });

  if (error) throw new Error(error.message);
}

// ─── Update Order ─────────────────────────────────────────────────────────────

export interface ReservationUpdatePayload {
  id: string;
  table_id: string;
  status: OrderStatus;
}

/**
 * Update status order (misal: reserved → process atau canceled).
 */
export async function updateOrderReservation(
  payload: ReservationUpdatePayload,
): Promise<void> {
  const { id, table_id, status } = payload;

  const { error } = await supabase
    .from("orders")
    .update({ status, table_id: table_id ? Number(table_id) : null })
    .eq("id", Number(id));

  if (error) throw new Error(error.message);

  // Jika di-cancel, bebaskan meja
  if (status === "canceled" && table_id) {
    const { error: tableError } = await supabase
      .from("tables")
      .update({ status: "available" })
      .eq("id", Number(table_id));

    if (tableError) throw new Error(tableError.message);
  }
}


// ─── Order Menu Items ─────────────────────────────────────────────────────────

/**
 * Menambahkan item menu ke order yang sudah ada.
 */
export async function addItemsToOrder(items: CartItemInsert[]): Promise<void> {
  if (items.length === 0) return;

  const insertPayload = items.map((item) => ({
    order_id: item.order_id,
    menu_id: item.menu_id,
    quantity: item.quantity,
    nominal: item.nominal,
    notes: item.notes || null,
    status: item.status,
  }));

  const { error } = await supabase.from("orders_menus").insert(insertPayload);

  if (error) throw new Error(error.message);
}

/**
 * Update status satu item menu (pending → process → ready → served).
 */
export async function updateOrderItemStatus(
  id: number,
  status: OrderMenuStatus,
): Promise<void> {
  const { error } = await supabase
    .from("orders_menus")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

