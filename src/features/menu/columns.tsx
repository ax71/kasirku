import DropdownActions from "@/components/common/dropdown-actions";
import type { MenuItem } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import { CATEGORY_LIST } from "./constants";

type SetSelectedAction = React.Dispatch<
  React.SetStateAction<{
    data: MenuItem | null;
    type: "update" | "delete" | null;
  }>
>;

/** Format number to Rupiah currency string */
function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getMenuColumns(
  setSelectedAction: SetSelectedAction,
  currentPage: number,
  currentLimit: number,
): ColumnDef<MenuItem>[] {
  return [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (currentPage - 1) * currentLimit + row.index + 1,
    },
    {
      accessorKey: "image_url",
      header: "Gambar",
      cell: ({ row }) => {
        const url = row.original.image_url;
        return url ? (
          <img
            src={url}
            alt={row.original.name}
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
            —
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nama Menu",
    },
    {
      accessorKey: "price",
      header: "Harga",
      cell: ({ row }) => formatRupiah(row.original.price),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => {
        const categoryVal = row.original.category;
        const categoryLabel = CATEGORY_LIST.find(
          (c) => c.value === categoryVal,
        )?.label;
        return categoryLabel ?? categoryVal ?? "—";
      },
    },
    {
      accessorKey: "is_available",
      header: "Status",
      cell: ({ row }) =>
        row.original.is_available ? (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            Tersedia
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Habis
          </span>
        ),
    },
    {
      id: "actions",
      header: "actions",
      cell: ({ row }) => (
        <DropdownActions
          menu={[
            {
              label: "Edit",
              action: () =>
                setSelectedAction({ data: row.original, type: "update" }),
            },
            {
              label: "Delete",
              variant: "destructive",
              action: () =>
                setSelectedAction({ data: row.original, type: "delete" }),
            },
          ]}
        />
      ),
    },
  ];
}
