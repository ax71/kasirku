// Tipe Cart digunakan di POS Catalog (sisi kiri) saat menambah item ke keranjang.
// Referensi: Next.js project /src/types/order.d.ts

import type { MenuItem } from "@/features/menu/types";

/** Satu baris item dalam keranjang POS */
export interface CartItem {
  menu_id: string;
  quantity: number;
  /** Harga total untuk baris ini (quantity * harga_satuan_setelah_diskon) */
  nominal: number;
  notes: string;
  /** Referensi ke data menu penuh, untuk tampilan di cart sidebar */
  menu: MenuItem;
  order_id?: string | number;
}

/** Tipe data yang dikirim ke Supabase tabel orders_menus (tanpa relasi menu) */
export type CartItemInsert = Omit<CartItem, "menu">;
