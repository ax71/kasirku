import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuKeys } from "./query-keys";
import { updateMenu, type UpdateMenuInput } from "../services/menu-service";
import { toast } from "sonner";

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMenuInput) => updateMenu(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      toast.success("Menu berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui menu");
    },
  });
}
