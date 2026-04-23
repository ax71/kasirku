import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePricing } from "../../hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import { useProfile } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import type { OrderDetail, OrderMenuItem } from "../../types/order";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

interface SummaryProps {
  order: Pick<OrderDetail, "order_id" | "customer_name" | "tables" | "status">;
  orderMenu: OrderMenuItem[];
  id: string;
  onPaymentSuccess?: () => void;
}

export default function Summary({
  order,
  orderMenu,
  id: _id,
  onPaymentSuccess,
}: SummaryProps) {
  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);
  const { data: profile } = useProfile();
  const [isPendingPayment, setIsPendingPayment] = useState(false);

  // Load Midtrans Snap script
  useEffect(() => {
    const snapUrl = import.meta.env.VITE_MIDTRANS_SNAP_URL;
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    if (!snapUrl || !clientKey) return;

    const script = document.createElement("script");
    script.src = snapUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePay = async () => {
    setIsPendingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-payment",
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: { 
            order_id: order.order_id,
            baseUrl: window.location.origin 
          },
        },
      );

      if (error) throw error;

      if (data?.token) {
        window.snap.pay(data.token, {
          onSuccess: (result: any) => {
            toast.success("Payment success!");
            console.log(result);
            onPaymentSuccess?.();
          },
          onPending: (result: any) => {
            toast.info("Payment pending...");
            console.log(result);
          },
          onError: (result: any) => {
            toast.error("Payment failed!");
            console.log(result);
          },
          onClose: () => {
            toast.warning(
              "You closed the payment popup without finishing the payment",
            );
          },
        });
      }
    } catch (error: any) {
      toast.error("Failed to initiate payment", { description: error.message });
    } finally {
      setIsPendingPayment(false);
    }
  };

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
              onClick={handlePay}
              disabled={isPendingPayment || !isAllServed}
              className="w-full font-semibold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer disabled:opacity-60"
            >
              {isPendingPayment && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isAllServed ? "Pay Now" : "Wait for all items served"}
            </Button>
          )}

          {order.status === "settled" && (
            <div className="w-full p-3 bg-green-100 text-green-700 text-center rounded-md font-bold">
              PAID & SETTLED
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
