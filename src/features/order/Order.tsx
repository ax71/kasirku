import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Utensils } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import supabase from "@/lib/supabase";
import { useProfile } from "@/features/auth/hooks/use-auth";
import DataTable from "@/features/user/components/data-table";
import DialogCreateOrderDineIn from "./components/create-order-dine-in";
import DialogCreateOrderTakeaway from "./components/create-order-takeaway";
import { updateOrderReservation } from "./services/order-service";
import { getOrderColumns } from "./columns";
import type { OrderRow, OrderStatus, TableRow } from "./types/order";

export default function OrderManagement() {
  const queryClient = useQueryClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  const { data: profile } = useProfile();

  const {
    data: orders,
    isLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("orders")
        .select(
          `id, order_id, customer_name, status, payment_token, tables(name, id)`,
          { count: "exact" },
        )
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `order_id.ilike.%${currentSearch}%,customer_name.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error) {
        toast.error("Get Order data Failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const { data: tables, refetch: refetchTables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const result = await supabase
        .from("tables")
        .select("*")
        .order("created_at")
        .order("status");

      return result.data as TableRow[] | null;
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("change-order")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          refetchOrders();
          refetchTables();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalPages = useMemo(() => {
    return orders && orders.count !== null
      ? Math.ceil(orders.count / currentLimit)
      : 0;
  }, [orders, currentLimit]);

  const { mutate: handleReservation } = useMutation({
    mutationFn: (payload: {
      id: string;
      table_id: string;
      status: OrderStatus;
    }) => updateOrderReservation(payload),
    onSuccess: () => {
      toast.success("Update reserved Success");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error("Update reserved Failed", { description: error.message });
    },
  });

  const columns = useMemo(
    () =>
      getOrderColumns(
        currentPage,
        currentLimit,
        profile?.role,
        handleReservation,
      ),
    [currentPage, currentLimit, profile?.role, handleReservation],
  );

  const [openCreatedOrder, setOpenCreatedOrder] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between">
        <p className="text-2xl font-bold">Order Management</p>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          {profile?.role !== "kitchen" && (
            <DropdownMenu
              open={openCreatedOrder}
              onOpenChange={setOpenCreatedOrder}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Create</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="font-bold">
                  Create Order
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger className="flex items-center gap-2 text-sm p-2 w-full hover:bg-muted rounded-md cursor-pointer">
                    <Utensils className="size-4" />
                    Dine In
                  </DialogTrigger>
                  <DialogCreateOrderDineIn
                    tables={tables}
                    closeDialog={() => setOpenCreatedOrder(false)}
                  />
                </Dialog>
                <Dialog>
                  <DialogTrigger className="flex items-center gap-2 text-sm p-2 w-full hover:bg-muted rounded-md cursor-pointer">
                    <Package className="size-4" />
                    Takeaway
                  </DialogTrigger>
                  <DialogCreateOrderTakeaway
                    closeDialog={() => setOpenCreatedOrder(false)}
                  />
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={(orders?.data as OrderRow[]) ?? []}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
    </div>
  );
}
