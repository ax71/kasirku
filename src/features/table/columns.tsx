import DropdownActions from "@/components/common/dropdown-actions";
import type { TableItem } from "./table-validations";
import type { ColumnDef } from "@tanstack/react-table";
import { STATUS_TABLE_LIST } from "./constant";

type SetSelectedAction = React.Dispatch<
  React.SetStateAction<{
    data: TableItem | null;
    type: "update" | "delete" | null;
  }>
>;

export function getTableColumns(
  setSelectedAction: SetSelectedAction,
  currentPage: number,
  currentLimit: number,
): ColumnDef<TableItem>[] {
  return [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (currentPage - 1) * currentLimit + row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Nama Meja",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const val = row.original.status;
        const mapped = STATUS_TABLE_LIST.find(
          (item) => item.value === val,
        )?.label;

        let colorClass = "bg-gray-100 text-gray-800";
        if (val === "available") {
          colorClass = "bg-emerald-100 text-emerald-800";
        } else if (val === "unavailable") {
          colorClass = "bg-red-100 text-red-800";
        } else if (val === "reserved") {
          colorClass = "bg-amber-100 text-amber-800";
        }

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
          >
            {mapped ?? val}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
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
