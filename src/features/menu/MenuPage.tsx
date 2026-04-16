import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import DataTable from "@/features/user/components/data-table"; // Reuse data-table from user or common
import { getMenuColumns } from "./columns";
import { useMemo, useState } from "react";
import DialogCreateMenu from "./components/dialog-create-menu";
import DialogUpdateMenu from "./components/dialog-update-menu";
import DialogDeleteMenu from "./components/dialog-delete-menu";
import type { MenuItem } from "./types";
import { useMenuQuery } from "./hooks/use-menu-query";
import CategoryTabs from "./components/category-tabs";
import { Search } from "lucide-react";
import { CATEGORY_LIST } from "./constants";

const MenuPage = () => {
  const [selectedAction, setSelectedAction] = useState<{
    data: MenuItem | null;
    type: "update" | "delete" | null;
  }>({ data: null, type: null });

  const {
    currentPage,
    currentLimit,
    currentSearch,
    currentFilter: category,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
    handleChangeFilter,
  } = useDataTable();

  // Query menu items
  const { data: menuData, isLoading: isMenuLoading } = useMenuQuery({
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
    category: category || undefined,
  });

  const columns = useMemo(
    () => getMenuColumns(setSelectedAction, currentPage, currentLimit),
    [currentPage, currentLimit],
  );

  const totalPages = menuData ? Math.ceil(menuData.count / currentLimit) : 0;

  const handleCloseDialog = () => {
    setSelectedAction((prev) => ({ ...prev, type: null }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-4 lg:items-center justify-between">
        <h1 className="text-xl font-semibold">Menu Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari menu..."
              className="pl-8 sm:w-[250px]"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Tambah Menu</Button>
            </DialogTrigger>
            <DialogCreateMenu
              onOpenChange={(open) => !open && handleCloseDialog()}
            />
          </Dialog>
        </div>
      </div>

      <CategoryTabs
        categories={CATEGORY_LIST}
        activeId={category || undefined}
        onSelect={(val) => handleChangeFilter(val || "")}
        isLoading={false}
      />

      <DataTable
        columns={columns}
        data={menuData?.data ?? []}
        isLoading={isMenuLoading}
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
        <DialogUpdateMenu
          key={selectedAction.data?.id || "update-menu"}
          currentData={selectedAction.data || undefined}
          open={selectedAction.type === "update"}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      </Dialog>
      <Dialog
        open={selectedAction.type === "delete"}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogDeleteMenu
          key={selectedAction.data?.id || "delete-menu"}
          currentData={selectedAction.data || undefined}
          open={selectedAction.type === "delete"}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      </Dialog>
    </div>
  );
};

export default MenuPage;
