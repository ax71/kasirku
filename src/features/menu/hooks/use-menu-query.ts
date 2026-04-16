import { useQuery } from "@tanstack/react-query";
import { menuKeys } from "./query-keys";
import { getMenuItems } from "../services/menu-service";

interface UseMenuQueryParams {
  page: number;
  limit: number;
  search: string;
  category?: string;
}

export function useMenuQuery(params: UseMenuQueryParams) {
  return useQuery({
    queryKey: menuKeys.list(params),
    queryFn: () => getMenuItems(params),
  });
}
