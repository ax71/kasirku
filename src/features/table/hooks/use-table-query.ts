import { useQuery } from "@tanstack/react-query";
import { tableKeys } from "./query-keys";
import { getTables, type GetTablesParams } from "../services/table-service";

export function useTableQuery(params: GetTablesParams) {
  return useQuery({
    queryKey: tableKeys.list(params),
    queryFn: () => getTables(params),
  });
}
