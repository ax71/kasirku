import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { convertIDR } from "@/lib/utils";
import { usePricing } from "../hooks/use-pricing";
import type { OrderDetail, OrderMenuItem } from "../types/order";

interface ReceiptProps {
  order: Pick<
    OrderDetail,
    "customer_name" | "tables" | "status" | "created_at"
  >;
  orderId: string;
  orderMenu: OrderMenuItem[];
}

export default function Receipt({ order, orderId, orderMenu }: ReceiptProps) {
  const { totalPrice, tax, service, grandTotal } = usePricing(orderMenu);
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => reactToPrintFn()}>
        Print Receipt
      </Button>

      <div className="absolute -z-10 top-0 left-0 opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
        <div
          ref={contentRef}
          className="w-[80mm] flex flex-col p-4 bg-white text-black font-mono"
        >
          <h4 className="text-xl font-bold text-center pb-3 border-b border-dashed border-black">
            PC-POS RESTO
          </h4>
          <div className="py-3 border-b border-dashed border-black text-xs space-y-1">
            <p>
              Bill NO : <span className="font-bold">{orderId}</span>
            </p>
            <p>
              Table :{" "}
              <span className="font-bold">
                {order.tables?.name ?? "Takeaway"}
              </span>
            </p>
            <p>
              Customer :{" "}
              <span className="font-bold">{order.customer_name}</span>
            </p>
            <p>
              Date :{" "}
              <span className="font-bold">
                {new Date(order.created_at).toLocaleString("id-ID")}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2 py-3 border-b border-dashed border-black text-xs">
            {orderMenu.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start gap-2"
              >
                <div>
                  <p>
                    {item.menus?.name ?? "Menu"} x {item.quantity}
                  </p>
                  {item.notes && (
                    <p className="text-[10px] text-gray-500">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
                <p className="whitespace-nowrap">{convertIDR(item.nominal)}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-xs pt-3 font-semibold pb-4">
            <div className="flex justify-between items-center">
              <p>Subtotal</p>
              <p>{convertIDR(totalPrice)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Tax (12%)</p>
              <p>{convertIDR(tax)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Service (5%)</p>
              <p>{convertIDR(service)}</p>
            </div>
            <div className="flex justify-between items-center text-sm mt-1 pt-1 border-t border-black">
              <p>Total</p>
              <p>{convertIDR(grandTotal)}</p>
            </div>
          </div>

          <div className="text-center text-[10px] space-y-1 pt-4 border-t border-dashed border-black">
            <p>Thank You For Your Visit</p>
            <p>Powered by PC-POS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
