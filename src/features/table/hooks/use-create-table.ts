import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTable, type CreateTableInput } from "../services/table-service";
import { tableKeys } from "./query-keys";

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTableInput) => createTable(input),
    onSuccess: () => {
      toast.success("Meja berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
    onError: (error) => {
      toast.error(`Gagal menambahkan meja: ${error.message}`);
    },
  });
}
