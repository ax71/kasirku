import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { TableItem } from "../table-validations";
import { useDeleteTable } from "../hooks/use-delete-table";

interface DialogDeleteTableProps {
  currentData?: TableItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogDeleteTable({
  currentData,
  onOpenChange,
}: DialogDeleteTableProps) {
  const { mutate, isPending } = useDeleteTable();

  const onDelete = () => {
    if (!currentData?.id) return;
    mutate(currentData.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Hapus Meja</DialogTitle>
        <DialogDescription>
          Apakah Anda yakin ingin menghapus meja{" "}
          <span className="font-bold">{currentData?.name}</span>? Data yang
          dihapus tidak dapat dikembalikan.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Batal</Button>
        </DialogClose>
        <Button variant="destructive" onClick={onDelete} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Hapus Meja
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
