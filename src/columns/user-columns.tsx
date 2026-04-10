import DropdownActions from "@/components/common/dropdown-actions";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getUserColumns = (
  setSelectedAction: (val: {
    data: UserProfile | null;
    type: "update" | "delete" | null;
  }) => void,
  currentPage: number,
  currentLimit: number,
): ColumnDef<UserProfile>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => {
      return (currentPage - 1) * currentLimit + row.index + 1;
    },
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownActions
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil className="w-4 h-4" /> Edit
                </span>
              ),
              action: () => {
                setSelectedAction({
                  data: user,
                  type: "update",
                });
              },
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" /> Delete
                </span>
              ),
              variant: "destructive",
              action: () => {
                setSelectedAction({
                  data: user,
                  type: "delete",
                });
              },
            },
          ]}
        />
      );
    },
  },
];
