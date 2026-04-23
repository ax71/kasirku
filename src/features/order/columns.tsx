import type { ColumnDef } from "@tanstack/react-table";
import type { OrderMenuItem, OrderMenuStatus, OrderRow, OrderStatus } from "./types/order";
import { Ban, EllipsisVertical, Link2Icon, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, convertIDR } from "@/lib/utils";
import DropdownActions from "@/components/common/dropdown-actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getOrderColumns = (
  currentPage: number,
  currentLimit: number,
  profileRole: string | undefined,
  handleReservation: (payload: {
    id: string;
    table_id: string;
    status: OrderStatus;
  }) => void,
): ColumnDef<OrderRow>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => {
      return (currentPage - 1) * currentLimit + row.index + 1;
    },
  },
  {
    accessorKey: "order_id",
    header: "Order ID",
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    id: "table",
    header: "Table",
    cell: ({ row }) => {
      const tables = row.original.tables as unknown as { name: string } | null;
      return tables?.name ?? "Takeaway";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white text-xs w-fit capitalize",
            {
              "bg-lime-600": status === "settled",
              "bg-sky-600": status === "process",
              "bg-amber-600": status === "reserved",
              "bg-red-600": status === "canceled",
            },
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const order = row.original;
      const table = order.tables as unknown as { id: number; name: string } | null;

      const menu =
        order.status === "reserved" && profileRole !== "kitchen"
          ? [
              {
                label: (
                  <span className="flex items-center gap-2">
                    <Link2Icon className="size-4" />
                    Process
                  </span>
                ),
                action: () => {
                  handleReservation({
                    id: String(order.id),
                    table_id: String(table?.id ?? ""),
                    status: "process",
                  });
                },
              },
              {
                label: (
                  <span className="flex items-center gap-2">
                    <Ban className="size-4" />
                    Cancel
                  </span>
                ),
                action: () => {
                  handleReservation({
                    id: String(order.id),
                    table_id: String(table?.id ?? ""),
                    status: "canceled",
                  });
                },
              },
            ]
          : [
              {
                label: (
                  <Link
                    to={`/admin/order/${order.order_id}`}
                    className="flex items-center gap-2"
                  >
                    <ScrollText className="size-4" />
                    Detail
                  </Link>
                ),
                type: "link" as const,
              },
            ];

      return <DropdownActions menu={menu} />;
    },
  },
];

export const getOrderItemColumns = (
  currentPage: number,
  currentLimit: number,
  handleUpdateStatus: (payload: { itemId: number; status: OrderMenuStatus }) => void
): ColumnDef<OrderMenuItem>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => (currentPage - 1) * currentLimit + row.index + 1,
  },
  {
    id: "menu",
    header: "Menu",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-2">
          {item.menus?.image_url ? (
            <img
              src={item.menus.image_url}
              alt={item.menus.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center text-xs font-semibold text-slate-500">
              M
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">
              {item.menus?.name} x {item.quantity}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.notes ?? "No Notes"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "nominal",
    header: "Nominal",
    cell: ({ row }) => convertIDR(row.original.nominal),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={cn(
            "px-2 py-1 rounded-full text-white text-xs w-fit capitalize font-medium",
            {
              "bg-gray-500": status === "pending",
              "bg-yellow-500": status === "process",
              "bg-blue-500": status === "ready",
              "bg-green-500": status === "served",
            },
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const item = row.original;
      const statusFlow: OrderMenuStatus[] = ["pending", "process", "ready", "served"];
      const currentStatusIndex = statusFlow.indexOf(item.status);
      const nextStatus =
        currentStatusIndex >= 0 && currentStatusIndex < statusFlow.length - 1
          ? statusFlow[currentStatusIndex + 1]
          : null;

      if (item.status === "served") return null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8 p-0"
            >
              <EllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {nextStatus && (
              <DropdownMenuItem
                onClick={() =>
                  handleUpdateStatus({
                    itemId: item.id,
                    status: nextStatus,
                  })
                }
                className="capitalize cursor-pointer"
              >
                Set as {nextStatus}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
