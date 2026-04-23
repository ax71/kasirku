import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  orderTakeawayFormSchema,
  type OrderTakeawayForm,
} from "../types/order-validation";
import { INITIAL_ORDER_TAKEAWAY } from "../types/order-constants";
import { createOrderTakeaway } from "../services/order-service";
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
import FormInput from "@/features/user/components/form-input";

export default function DialogCreateOrderTakeaway({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<OrderTakeawayForm>({
    resolver: zodResolver(orderTakeawayFormSchema),
    defaultValues: INITIAL_ORDER_TAKEAWAY,
  });

  const { mutate: submitCreateOrder, isPending } = useMutation({
    mutationFn: createOrderTakeaway,
    onSuccess: () => {
      toast.success("Create Takeaway Order Success");
      form.reset();
      closeDialog();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error("Create Takeaway Order Failed", {
        description: error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    submitCreateOrder({ customer_name: data.customer_name });
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>Create Takeaway Order</DialogTitle>
          <DialogDescription>
            Add a new takeaway order — no table required
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4 max-h-[48vh] p-1 overflow-y-auto">
            <FormInput
              form={form}
              name="customer_name"
              label="Customer Name"
              placeholder="Insert customer name here"
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
