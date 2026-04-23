import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("order_id");

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] space-y-4">
      {status === "success" ? (
        <>
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p>Order {orderId} has been paid.</p>
        </>
      ) : (
        <>
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p>Something went wrong with order {orderId}.</p>
        </>
      )}
      <Button asChild>
        <Link to="/admin/order">Back to Orders</Link>
      </Button>
    </div>
  );
}
