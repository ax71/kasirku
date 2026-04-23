import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePricing } from "../../hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import { useProfile } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import type { OrderDetail, OrderMenuItem } from "../../types/order";

interface SummaryProps {
  order: Pick<OrderDetail, "customer_name" | "tables" | "status">;
  orderMenu: OrderMenuItem[];
  id: string;
  onPaymentSuccess?: () => void;
}

export default function Summary({
  order,
  orderMenu,
  id: _id,
  onPaymentSuccess: _onPaymentSuccess,
}: SummaryProps) {
  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);
  const { data: profile } = useProfile();

  const isAllServed = useMemo(() => {
    return (
      orderMenu.length > 0 &&
      orderMenu.every((item) => item.status === "served")
    );
  }, [orderMenu]);

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={order.customer_name} disabled />
          </div>
          <div className="space-y-2">
            <Label>Table</Label>
            <Input value={order.tables?.name ?? "Takeaway"} disabled />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="flex justify-between items-center text-sm">
            <p>Subtotal</p>
            <p>{convertIDR(totalPrice)}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Tax (12%)</p>
            <p>{convertIDR(tax)}</p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>Service (5%)</p>
            <p>{convertIDR(service)}</p>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold">{convertIDR(grandTotal)}</p>
          </div>

          {order.status === "process" && profile?.role !== "kitchen" && (
            <Button
              type="button"
              disabled
              title="Pembayaran akan diaktifkan pada fase berikutnya"
              className="w-full font-semibold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer disabled:opacity-60"
            >
              <Loader2 className="hidden" />
              Pay (Coming Soon)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
