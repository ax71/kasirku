import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddOrderItem from "./components/add-order-item";

export default function AddOrderItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-xl font-bold">Order ID tidak ditemukan.</p>
        <Button onClick={() => navigate("/order")}>Kembali ke Daftar</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/order/${id}`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <p className="text-2xl font-bold">Add Order Item</p>
          <p className="text-sm text-muted-foreground">Order: {id}</p>
        </div>
      </div>

      <AddOrderItem id={id} />
    </div>
  );
}
