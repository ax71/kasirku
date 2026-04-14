import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, type DeleteUserInput } from "../services/user-service";
import { userKeys } from "./query-keys";
import { toast } from "sonner";

/**
 * Mutation hook for deleting a user.
 * Automatically invalidates the users list cache on success.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteUserInput) => deleteUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Delete User Success");
    },
    onError: (error) => {
      toast.error(error.message || "Delete User Failed");
    },
  });
}
