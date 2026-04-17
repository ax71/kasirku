import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import DataTable from "@/features/user/components/data-table";
import { getTableColumns } from "./columns";
import { useMemo, useState } from "react";
import DialogCreateTable from "./components/dialog-create-table";
import DialogUpdateTable from "./components/dialog-update-table";
import DialogDeleteTable from "./components/dialog-delete-table";
import type { TableItem } from "./table-validations";
import { useTableQuery } from "./hooks/use-table-query";
import CategoryTabs from "@/features/menu/components/category-tabs";
import { Search } from "lucide-react";
import { STATUS_TABLE_LIST } from "./constant";

const TablePage = () => {
  const [selectedAction, setSelectedAction] = useState<{
    data: TableItem | null;
    type: "update" | "delete" | null;
  }>({ data: null, type: null });

  const {
    currentPage,
    currentLimit,
    currentSearch,
    currentFilter: status,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
    handleChangeFilter,
  } = useDataTable();

  // Query tables
  const { data: tableData, isLoading: isTableLoading } = useTableQuery({
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
    status: status || undefined,
  });

  const columns = useMemo(
    () => getTableColumns(setSelectedAction, currentPage, currentLimit),
    [currentPage, currentLimit],
  );

  const totalPages = tableData ? Math.ceil(tableData.count / currentLimit) : 0;

  const handleCloseDialog = () => {
    setSelectedAction((prev) => ({ ...prev, type: null }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-4 lg:items-center justify-between">
        <h1 className="text-xl font-semibold">Table Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari meja..."
              className="pl-8 sm:w-[250px]"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Tambah Meja</Button>
            </DialogTrigger>
            <DialogCreateTable
              onOpenChange={(open) => !open && handleCloseDialog()}
            />
          </Dialog>
        </div>
      </div>

      <CategoryTabs
        categories={STATUS_TABLE_LIST}
        activeId={status || undefined}
        onSelect={(val) => handleChangeFilter(val || "")}
        isLoading={false}
      />

      <DataTable
        columns={columns}
        data={tableData?.data ?? []}
        isLoading={isTableLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />

      <Dialog
        open={selectedAction.type === "update"}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogUpdateTable
          key={selectedAction.data?.id || "update-table"}
          currentData={selectedAction.data || undefined}
          open={selectedAction.type === "update"}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      </Dialog>
      <Dialog
        open={selectedAction.type === "delete"}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogDeleteTable
          key={selectedAction.data?.id || "delete-table"}
          currentData={selectedAction.data || undefined}
          open={selectedAction.type === "delete"}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      </Dialog>
    </div>
  );
};

export default TablePage;
