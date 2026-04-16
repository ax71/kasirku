import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MenuItem } from "../types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDeleteMenu } from "../hooks/use-delete-menu";

interface DialogDeleteMenuProps {
  open: boolean;
  currentData?: MenuItem;
  onOpenChange: (open: boolean) => void;
}

export default function DialogDeleteMenu({
  currentData,
  onOpenChange,
}: DialogDeleteMenuProps) {
  const { mutate, isPending } = useDeleteMenu();

  const onSubmit = () => {
    if (!currentData?.id) return;

    mutate(
      {
        id: currentData.id,
        imageUrl: currentData.image_url ?? undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Hapus Menu</DialogTitle>
        <DialogDescription>
          Apakah Anda yakin ingin menghapus menu{" "}
          <strong>{currentData?.name}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Batal
        </Button>
        <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Hapus"}
        </Button>
      </div>
    </DialogContent>
  );
}
