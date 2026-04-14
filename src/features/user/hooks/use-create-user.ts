import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, type CreateUserInput } from "../services/user-service";
import { userKeys } from "./query-keys";
import { toast } from "sonner";

/**
 * Mutation hook for creating a new user.
 * Automatically invalidates the users list cache on success.
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("Create User Success");
    },
    onError: (error) => {
      toast.error(error.message || "Create User Failed");
    },
  });
}
