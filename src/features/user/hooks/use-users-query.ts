import { useQuery } from "@tanstack/react-query";
import { getUsers, type GetUsersParams } from "../services/user-service";
import { userKeys } from "./query-keys";

/**
 * Hook to fetch paginated, searchable users list.
 * Replaces the inline queryFn that was previously in User.tsx.
 */
export function useUsersQuery(params: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  });
}
