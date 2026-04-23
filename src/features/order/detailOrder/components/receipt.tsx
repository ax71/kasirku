import { Button } from "@/components/ui/button";
import { usePricing } from "../../hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type { OrderDetail, OrderMenuItem } from "../../types/order";

interface ReceiptProps {
  order: Pick<OrderDetail, "customer_name" | "tables" | "status" | "created_at">;
  orderMenu: OrderMenuItem[] | null | undefined;
  orderId: string;
}

const Receipt = ({ order, orderId, orderMenu }: ReceiptProps) => {
  const safeMenu = orderMenu ?? [];
  const { totalPrice, tax, service, grandTotal } = usePricing(safeMenu);
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="relative">
      <Button onClick={() => reactToPrintFn()}>Print Receipt</Button>
      <div
        ref={contentRef}
        className="w-full flex flex-col p-8 absolute -z-10 top-0 bg-white text-black font-mono"
      >
        <h4 className="text-2xl font-bold text-center pb-4 border-b border-dashed">
          PC-POS RESTO
        </h4>
        <div className="py-4 border-b border-dashed text-sm space-y-2">
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

        <div className="flex flex-col gap-2 py-4 border-b border-dashed text-sm">
          {safeMenu.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <p>
                {item.menus?.name ?? "Menu"} x {item.quantity}
              </p>
              <p>{convertIDR(item.nominal)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 text-sm pt-4">
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
          <div className="flex justify-between items-center font-bold border-t pt-2">
            <p>Total</p>
            <p>{convertIDR(grandTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
