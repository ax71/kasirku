import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, type UpdateUserInput } from "../services/user-service";
import { userKeys } from "./query-keys";
import { toast } from "sonner";

/**
 * Mutation hook for updating an existing user.
 * Automatically invalidates the users list cache on success.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Update User Success");
    },
    onError: (error) => {
      toast.error(error.message || "Update User Failed");
    },
  });
}
