import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTable } from "../services/table-service";
import { tableKeys } from "./query-keys";

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTable(id),
    onSuccess: () => {
      toast.success("Meja berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: tableKeys.all });
    },
    onError: (error) => {
      toast.error(`Gagal menghapus meja: ${error.message}`);
    },
  });
}
