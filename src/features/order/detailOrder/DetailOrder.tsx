import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { useProfile } from "@/features/auth/hooks/use-auth";

import { Button } from "@/components/ui/button";

import useDataTable from "@/hooks/use-data-table";
import Receipt from "../components/receipt";
import DataTable from "@/features/user/components/data-table";
import { updateOrderItemStatus } from "../services/order-service";
import type {
  OrderDetail,
  OrderMenuItem,
  OrderMenuStatus,
} from "../types/order";
import Summary from "./components/summary";
import { getOrderItemColumns } from "../columns";

export default function DetailOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  const { currentPage, currentLimit, handleChangePage, handleChangeLimit } =
    useDataTable();

  // ─── Fetch Order ────────────────────────────────────────────────────────────
  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: ["order", id],
    queryFn: async (): Promise<OrderDetail> => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_id, customer_name, status, payment_token, created_at, tables(name, id)",
        )
        .eq("order_id", id ?? "")
        .single();

      if (error) throw error;
      return data as unknown as OrderDetail;
    },
    enabled: !!id,
  });

  // ─── Fetch Order Menu Items ──────────────────────────────────────────────────
  const {
    data: orderMenu,
    isLoading: isLoadingOrderMenu,
    refetch: refetchOrderMenu,
  } = useQuery({
    queryKey: ["orders_menu", order?.id, currentPage, currentLimit],
    queryFn: async (): Promise<{ data: OrderMenuItem[]; count: number }> => {
      const { data, error, count } = await supabase
        .from("orders_menus")
        .select("*, menus(id, name, image_url, price)", { count: "exact" })
        .eq("order_id", order?.id ?? 0)
        .order("status")
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1,
        );

      if (error) throw error;
      return {
        data: (data as unknown as OrderMenuItem[]) ?? [],
        count: count ?? 0,
      };
    },
    enabled: !!order?.id,
  });

  // ─── Realtime ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel("change-order-detail")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders_menus",
          filter: `order_id=eq.${order.id}`,
        },
        () => {
          refetchOrderMenu();
          queryClient.invalidateQueries({ queryKey: ["order", id] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id, id, queryClient, refetchOrderMenu]);

  // ─── Update Item Status ──────────────────────────────────────────────────────
  const { mutate: handleUpdateItemStatus } = useMutation({
    mutationFn: ({
      itemId,
      status,
    }: {
      itemId: number;
      status: OrderMenuStatus;
    }) => updateOrderItemStatus(itemId, status),
    onSuccess: () => {
      toast.success("Update status order success");
      refetchOrderMenu();
    },
    onError: (error: Error) => {
      toast.error("Update status order failed", { description: error.message });
    },
  });

  const columns = useMemo(
    () =>
      getOrderItemColumns(currentPage, currentLimit, handleUpdateItemStatus),
    [currentPage, currentLimit, handleUpdateItemStatus],
  );

  const totalPages = useMemo(() => {
    return orderMenu?.count ? Math.ceil(orderMenu.count / currentLimit) : 0;
  }, [orderMenu, currentLimit]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  if (isLoadingOrder) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold">Pesanan tidak ditemukan.</h2>
        <Button onClick={() => navigate("/order")}>Kembali ke Daftar</Button>
      </div>
    );
  }

  const isSettled =
    order.status === "settled" ||
    order.status === "paid" ||
    order.status === "completed";

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-center gap-4 w-full mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/order")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <p className="text-2xl font-bold">Detail Order</p>
            <p className="text-sm text-muted-foreground">{order.order_id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {profile?.role !== "kitchen" && order.status === "process" && (
            <Button onClick={() => navigate(`/order/${order.order_id}/add`)}>
              Add Order Item
            </Button>
          )}

          {isSettled && (
            <Receipt
              order={order}
              orderMenu={orderMenu?.data ?? []}
              orderId={order.order_id}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="lg:w-2/3">
          <DataTable
            columns={columns}
            data={orderMenu?.data ?? []}
            isLoading={isLoadingOrderMenu}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            onChangePage={handleChangePage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
        <div className="lg:w-1/3">
          <Summary
            order={order}
            orderMenu={orderMenu?.data ?? []}
            id={String(order.id)}
            onPaymentSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["order", id] });
            }}
          />
        </div>
      </div>
    </div>
  );
}
