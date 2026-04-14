import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import DataTable from "./components/data-table";
import { getUserColumns } from "./columns";
import { useMemo, useState } from "react";
import DialogCreateUser from "./components/dialog-create-user";
import DialogUpdateUser from "./components/dialog-update-user";
import DialogDeleteUser from "./components/dialog-delete-user";
import type { Profile } from "@/features/auth/types";
import { useUsersQuery } from "./hooks/use-users-query";

const UserPage = () => {
  const [selectedAction, setSelectedAction] = useState<{
    data: Profile | null;
    type: "update" | "delete" | null;
  }>({ data: null, type: null });

  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  const { data: users, isLoading } = useUsersQuery({
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  });

  const columns = useMemo(
    () => getUserColumns(setSelectedAction, currentPage, currentLimit),
    [currentPage, currentLimit],
  );

  const totalPages = users ? Math.ceil(users.count / currentLimit) : 0;

  const handleCloseDialog = () => {
    setSelectedAction((prev) => ({ ...prev, type: null }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between">
        <p className="text-xl font-semibold">User Management</p>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateUser
              onOpenChange={(open) => !open && handleCloseDialog()}
            />
          </Dialog>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={users?.data ?? []}
        isLoading={isLoading}
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
        <DialogUpdateUser
          key={selectedAction.data?.id || "update-user"}
          currentData={selectedAction.data || undefined}
          open={selectedAction.type === "update"}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      </Dialog>
      <Dialog
        open={selectedAction.type === "delete"}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogDeleteUser
          key={selectedAction.data?.id || "delete-user"}
          currentData={selectedAction.data || undefined}
          open={selectedAction.type === "delete"}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      </Dialog>
    </div>
  );
};

export default UserPage;

