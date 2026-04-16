import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuKeys } from "./query-keys";
import { deleteMenu, type DeleteMenuInput } from "../services/menu-service";
import { toast } from "sonner";

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteMenuInput) => deleteMenu(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      toast.success("Menu berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus menu");
    },
  });
}
