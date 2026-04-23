import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useDebounce from "@/hooks/use-debounce";
import { convertIDR } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { MenuItem } from "@/features/menu/types";
import type { CartItem } from "../../types/order";
import type { Dispatch, SetStateAction } from "react";

interface CardSectionProps {
  order: {
    customer_name: string;
    tables: { name: string } | null;
    status: string;
  } | null | undefined;
  carts: CartItem[];
  setCarts: Dispatch<SetStateAction<CartItem[]>>;
  onAddToCart: (item: MenuItem, type: "increment" | "decrement") => void;
  isLoading: boolean;
  onOrder: () => void;
}

export default function CardSection({
  order,
  carts,
  setCarts,
  onAddToCart,
  isLoading,
  onOrder,
}: CardSectionProps) {
  const debounce = useDebounce();

  const handleAddNote = (menuId: number, notes: string) => {
    setCarts((prev) =>
      prev.map((item) =>
        item.menu_id === menuId ? { ...item, notes } : item,
      ),
    );
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        {order && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={order.customer_name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Table</Label>
              <Input
                value={order.tables?.name ?? "Takeaway"}
                disabled
              />
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cart</h3>
          {carts.length > 0 ? (
            carts.map((item: CartItem) => (
              <div key={item.menu.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {item.menu.image_url ? (
                      <img
                        src={item.menu.image_url}
                        alt={item.menu.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {item.menu.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm">{item.menu.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {convertIDR(item.nominal / item.quantity)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs">{convertIDR(item.nominal)}</p>
                </div>
                <div className="flex items-center gap-4 w-full">
                  <Input
                    placeholder="Add notes"
                    className="w-full"
                    onChange={(e) =>
                      debounce(
                        () => handleAddNote(item.menu.id, e.target.value),
                        500,
                      )
                    }
                  />
                  <div className="flex items-center gap-4">
                    <Button
                      className="font-semibold cursor-pointer"
                      variant="outline"
                      type="button"
                      onClick={() => onAddToCart(item.menu, "decrement")}
                    >
                      -
                    </Button>
                    <p className="font-semibold">{item.quantity}</p>
                    <Button
                      className="font-semibold cursor-pointer"
                      variant="outline"
                      type="button"
                      onClick={() => onAddToCart(item.menu, "increment")}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No item in cart</p>
          )}
          <Button
            type="button"
            onClick={onOrder}
            disabled={carts.length === 0 || isLoading}
            className="w-full font-semibold bg-amber-500 hover:bg-amber-600 cursor-pointer text-white"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
