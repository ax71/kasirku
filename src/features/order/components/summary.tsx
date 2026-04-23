import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { usePricing } from "../hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import type { OrderDetail, OrderMenuItem } from "../types/order";

interface SummaryProps {
  order: Pick<
    OrderDetail,
    "id" | "customer_name" | "tables" | "status" | "order_id"
  >;
  orderMenu: OrderMenuItem[];
  id: string;
  onPaymentSuccess?: () => void;
}

export default function Summary({
  order,
  orderMenu,
  onPaymentSuccess,
}: SummaryProps) {
  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

  // ──────────────────────────────────────────────────────────────────────────
  // Payment is temporarily DISABLED — will be activated in the next phase.
  // Do NOT remove the isPendingGeneratePayment state or handleGeneratePayment
  // skeleton — they will be wired up when the Edge Function is ready.
  // ──────────────────────────────────────────────────────────────────────────
  const [isPendingGeneratePayment] = useState(false);
  const isCompleted = order.status === "completed";

  // Load Midtrans Snap script — kept for future activation
  useEffect(() => {
    const clientKey = environment.MIDTRANS_CLIENT_KEY;
    if (!clientKey) return;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-5 space-y-5">
      <h3 className="text-lg font-semibold border-b pb-2">
        Informasi Konsumen
      </h3>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs uppercase">
            Nama
          </Label>
          <Input
            value={order.customer_name}
            disabled
            className="bg-slate-50 font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs uppercase">
            Detail Meja
          </Label>
          <Input
            value={order.tables?.name ?? "Bungkus (Takeaway)"}
            disabled
            className="bg-slate-50 font-medium"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ringkasan Tagihan</h3>
        <div className="flex justify-between items-center text-sm font-medium">
          <p className="text-muted-foreground">Subtotal</p>
          <p>{convertIDR(totalPrice)}</p>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
          <p className="text-muted-foreground">Pajak (12%)</p>
          <p>{convertIDR(tax)}</p>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
          <p className="text-muted-foreground">Layanan (5%)</p>
          <p>{convertIDR(service)}</p>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between items-center text-lg">
          <p className="font-semibold text-slate-700">Total Nominal</p>
          <p className="font-bold text-primary">{convertIDR(grandTotal)}</p>
        </div>

        {/* Payment button — disabled until Edge Function is activated */}
        <Button
          type="button"
          disabled
          title="Pembayaran akan diaktifkan pada fase berikutnya"
          className="w-full mt-4 h-12 text-md font-bold transition-all disabled:opacity-50"
        >
          {isPendingGeneratePayment ? (
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
          ) : null}
          {isCompleted ? "Proses Pembayaran (Coming Soon)" : "Menunggu Selesai"}
        </Button>
        <p className="text-xs text-center text-muted-foreground -mt-2">
          Integrasi pembayaran akan diaktifkan pada fase berikutnya.
        </p>
      </div>
    </div>
  );
}
