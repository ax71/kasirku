import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILTER_MENU } from "../../order-constants";
import useDataTable from "@/hooks/use-data-table";
import supabase from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CardMenu from "./card-menu";
import LoadingCardMenu from "./loading-card-menu";
import CardSection from "./cart";
import type { MenuItem } from "@/features/menu/types";
import type { CartItem, CartItemInsert, OrderDetail } from "../../types/order";
import { addItemsToOrder } from "../../services/order-service";

interface AddOrderItemProps {
  id: string; // order_id (INV-xxx string)
}

export default function AddOrderItem({ id }: AddOrderItemProps) {
  const queryClient = useQueryClient();
  const {
    currentSearch,
    currentFilter,
    handleChangeSearch,
    handleChangeFilter,
  } = useDataTable();

  const { data: menus, isLoading: isLoadingMenu } = useQuery({
    queryKey: ["menus", currentSearch, currentFilter],
    queryFn: async () => {
      const query = supabase
        .from("menus")
        .select("*", { count: "exact" })
        .order("created_at")
        .eq("is_available", true)
        .ilike("name", `%${currentSearch}%`);

      if (currentFilter) {
        query.eq("category", currentFilter);
      }

      const result = await query;

      if (result.error) {
        toast.error("Get Menu data Failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async (): Promise<OrderDetail | null> => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_id, customer_name, status, payment_token, created_at, tables(name, id)",
        )
        .eq("order_id", id)
        .single();

      if (error) {
        toast.error("Get Order data Failed", { description: error.message });
        return null;
      }
      return data as unknown as OrderDetail;
    },
    enabled: !!id,
  });

  const [carts, setCarts] = useState<CartItem[]>([]);

  const handleAddToCart = (
    menu: MenuItem,
    action: "increment" | "decrement",
  ) => {
    const existing = carts.find((item) => item.menu_id === menu.id);
    const priceAfterDiscount =
      menu.price - menu.price * ((menu.discount ?? 0) / 100);

    if (existing) {
      if (action === "decrement") {
        if (existing.quantity > 1) {
          setCarts((prev) =>
            prev.map((item) =>
              item.menu_id === menu.id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    nominal: item.nominal - priceAfterDiscount,
                  }
                : item,
            ),
          );
        } else {
          setCarts((prev) => prev.filter((item) => item.menu_id !== menu.id));
        }
      } else {
        setCarts((prev) =>
          prev.map((item) =>
            item.menu_id === menu.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  nominal: item.nominal + priceAfterDiscount,
                }
              : item,
          ),
        );
      }
    } else {
      setCarts((prev) => [
        ...prev,
        {
          menu_id: menu.id,
          quantity: 1,
          nominal: priceAfterDiscount,
          notes: "",
          menu,
        },
      ]);
    }
  };

  const { mutate: submitOrder, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      if (!order?.id) throw new Error("Order tidak ditemukan");

      const items: CartItemInsert[] = carts.map((item) => ({
        order_id: order.id,
        menu_id: item.menu_id,
        quantity: item.quantity,
        nominal: item.nominal,
        notes: item.notes,
        status: "pending",
      }));

      return addItemsToOrder(items);
    },
    onSuccess: () => {
      toast.success("Order items added successfully");
      setCarts([]);
      queryClient.invalidateQueries({ queryKey: ["orders_menu", order?.id] });
    },
    onError: (error: Error) => {
      toast.error("Failed to add order items", { description: error.message });
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <div className="space-y-6 lg:w-2/3">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Menu</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex gap-2 flex-wrap items-center">
              {FILTER_MENU.map((item) => (
                <Button
                  size="sm"
                  key={item.value}
                  type="button"
                  onClick={() => handleChangeFilter(item.value)}
                  variant={currentFilter === item.value ? "default" : "outline"}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <div className="w-full md:w-72">
              <Input
                className="w-full"
                placeholder="Search..."
                onChange={(e) => handleChangeSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoadingMenu && !menus ? (
          <LoadingCardMenu />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(menus?.data as unknown as MenuItem[] | undefined)?.map((menu) => (
              <CardMenu
                key={`menu-${menu.id}`}
                menu={menu}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {!isLoadingMenu && (menus?.data?.length ?? 0) === 0 && (
          <div className="text-center w-full text-muted-foreground py-8">
            No menu found
          </div>
        )}
      </div>

      <div className="lg:w-1/3">
        <CardSection
          order={
            order
              ? {
                  customer_name: order.customer_name ?? "",
                  tables: order.tables as { name: string } | null,
                  status: order.status ?? "",
                }
              : null
          }
          carts={carts}
          setCarts={setCarts}
          onAddToCart={handleAddToCart}
          isLoading={isSubmitting}
          onOrder={() => submitOrder()}
        />
      </div>
    </div>
  );
}
