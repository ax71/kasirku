import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import supabase from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import DataTable from "./components/data-table";
import { getUserColumns, type UserProfile } from "@/columns/user-columns";
import { useMemo, useState } from "react";
import DialogCreateUser from "./components/dialog-create-user";
import DialogUpdateUser from "./components/dialog-update-user";

const UserPage = () => {
  const [selectedAction, setSelectedAction] = useState<{
    data: UserProfile | null;
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

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get users data failed", {
          description: result.error.message,
        });

      // console.log(result);
      return result;
    },
  });

  const column = useMemo(
    () => getUserColumns(setSelectedAction, currentPage, currentLimit),
    [currentPage, currentLimit],
  );

  const fillterData = useMemo(() => {
    return users?.data || [];
  }, [users]);

  const totalPages = useMemo(() => {
    return users && users.count !== null
      ? Math.ceil(users.count / currentLimit)
      : 0;
  }, [users]);

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
            <DialogCreateUser refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        columns={column}
        data={fillterData}
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
          refetch={refetch}
          currentData={selectedAction.data || undefined}
          open={selectedAction.type === "update"}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      </Dialog>
    </div>
  );
};

export default UserPage;
