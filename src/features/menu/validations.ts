import { z } from "zod";

export const createMenuSchema = z.object({
  name: z.string().min(1, "Nama menu wajib diisi"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  discount: z.coerce.number().min(0).optional(),
  category: z.string().min(1, "Kategori wajib dipilih"),
  is_available: z.boolean().default(true),
  image: z.instanceof(File).or(z.string()).optional().nullable(),
});

export const updateMenuSchema = z.object({
  name: z.string().min(1, "Nama menu wajib diisi"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  discount: z.coerce.number().min(0).optional(),
  category: z.string().min(1, "Kategori wajib dipilih"),
  is_available: z.boolean(),
  image: z.instanceof(File).or(z.string()).optional().nullable(),
});

export type CreateMenuForm = z.infer<typeof createMenuSchema>;
export type UpdateMenuForm = z.infer<typeof updateMenuSchema>;
