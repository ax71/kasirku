import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderFormSchema, type OrderForm } from "../types/order-validation";
import { INITIAL_ORDER, STATUS_CREATE_ORDER } from "../types/order-constants";
import { createOrderDineIn } from "../services/order-service";
import type { TableRow } from "../types/order";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormSelect from "@/features/user/components/form-select";
import FormInput from "@/features/user/components/form-input";

export default function DialogCreateOrderDineIn({
  tables,
  closeDialog,
}: {
  tables: TableRow[] | undefined | null;
  closeDialog: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: INITIAL_ORDER,
  });

  const { mutate: submitCreateOrder, isPending } = useMutation({
    mutationFn: createOrderDineIn,
    onSuccess: () => {
      toast.success("Create Order Success");
      form.reset();
      closeDialog();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (error: Error) => {
      toast.error("Create Order Failed", { description: error.message });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    submitCreateOrder({
      customer_name: data.customer_name,
      table_id: data.table_id,
      status: data.status as "reserved" | "process",
    });
  });

  const availableTables = tables?.filter(
    (table) => table.status === "available",
  );

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>Create Order Dine In</DialogTitle>
          <DialogDescription>Add a new order from customer</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4 max-h-[48vh] p-1 overflow-y-auto">
            <FormInput
              form={form}
              name="customer_name"
              label="Customer Name"
              placeholder="Insert customer name here"
            />

            <FormSelect
              form={form}
              name="table_id"
              label="Table"
              selectItem={(tables ?? []).map((table) => ({
                value: `${table.id}`,
                label: `${table.name} - ${table.status}${table.capacity ? ` (${table.capacity})` : ""}`,
                disabled: table.status !== "available",
              }))}
            />
            {availableTables?.length === 0 && (
              <p className="text-xs text-destructive font-medium animate-pulse">
                All tables are currently occupied.
              </p>
            )}

            <FormSelect
              form={form}
              name="status"
              label="Status"
              selectItem={STATUS_CREATE_ORDER}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
