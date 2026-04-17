import z from "zod";

export const tableFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.string().min(1, "Status is required"),
});

export const tableSchema = z.object({
  name: z.string(),
  status: z.string(),
});

export type TableForm = z.infer<typeof tableFormSchema>;

export interface TableItem {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const INITIAL_TABLE_FORM: TableForm = {
  name: "",
  status: "available",
};
