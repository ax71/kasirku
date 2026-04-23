/**
 * Strict TypeScript types for the Order module.
 * Zero Any Policy — all shapes explicitly defined.
 */
import type { MenuItem } from "@/features/menu/types";

// ─── Domain Enums ────────────────────────────────────────────────────────────

export type OrderStatus =
  | "reserved"
  | "process"
  | "completed"
  | "settled"
  | "paid"
  | "canceled";

export type OrderMenuStatus = "pending" | "process" | "ready" | "served";

// ─── Table Row Shapes ─────────────────────────────────────────────────────────

/** Meja yang di-join ke dalam order query */
export interface OrderTable {
  id: number;
  name: string;
}

/** Satu baris dari tabel `orders` (list view) */
export interface OrderRow {
  id: number;
  order_id: string;
  customer_name: string;
  status: OrderStatus;
  payment_token: string | null;
  tables: OrderTable | null;
}

/** Detail lengkap order (single order query) */
export interface OrderDetail {
  id: number;
  order_id: string;
  customer_name: string;
  status: OrderStatus;
  payment_token: string | null;
  created_at: string;
  tables: OrderTable | null;
}

/** Satu baris dari tabel `orders_menus` dengan join ke `menus` */
export interface OrderMenuItem {
  id: number;
  order_id: number;
  menu_id: number;
  status: OrderMenuStatus;
  quantity: number;
  notes: string | null;
  nominal: number;
  menus: Pick<MenuItem, "id" | "name" | "image_url" | "price"> | null;
}

// ─── Cart Types (untuk halaman Add Order Item) ────────────────────────────────

/** Satu item dalam keranjang sebelum di-submit ke Supabase */
export interface CartItem {
  menu_id: number;
  quantity: number;
  /** Harga total baris ini (quantity × harga_satuan_setelah_diskon) */
  nominal: number;
  notes: string;
  /** Referensi ke data menu penuh, untuk tampilan di cart */
  menu: MenuItem;
}

/** Payload yang dikirim ke `orders_menus` (tanpa relasi menu) */
export type CartItemInsert = Omit<CartItem, "menu"> & {
  order_id: number;
  status: OrderMenuStatus;
};

// ─── Table Row Shape (untuk dropdown di create order) ─────────────────────────

export interface TableRow {
  id: number;
  name: string;
  status: string;
  capacity?: number | null;
}

// ─── Midtrans Integration ─────────────────────────────────────────────────────

/** Snap.js callback result */
export interface MidtransSnapResult {
  order_id: string;
  payment_type: string;
  transaction_status: string;
  gross_amount: string;
}

/** Extend Window untuk Midtrans Snap SDK */
export interface MidtransSnap {
  pay: (
    token: string,
    options?: {
      onSuccess?: (result: MidtransSnapResult) => void;
      onPending?: (result: MidtransSnapResult) => void;
      onError?: (result: MidtransSnapResult) => void;
      onClose?: () => void;
    },
  ) => void;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}
