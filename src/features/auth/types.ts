import type { ProfileRow } from "@/types/database";

/** User roles available in the system */
export type UserRole = "admin" | "cashier" | "kitchen";

/**
 * Profile as used by the application (post-fetch).
 * Derived from the DB row type but with non-nullable fields that are
 * guaranteed after auth signup (id, name, role).
 */
export type Profile = Omit<ProfileRow, "role"> & {
  role: UserRole;
  email?: string;
};

