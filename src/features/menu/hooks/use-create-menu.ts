import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuKeys } from "./query-keys";
import { createMenu, type CreateMenuInput } from "../services/menu-service";
import { toast } from "sonner";

export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMenuInput) => createMenu(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      toast.success("Menu berhasil ditambahkan");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menambahkan menu");
    },
  });
}
