import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTable, type UpdateTableInput } from "../services/table-service";
import { tableKeys } from "./query-keys";

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTableInput) => updateTable(input),
    onSuccess: () => {
      toast.success("Data meja berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui meja: ${error.message}`);
    },
  });
}
