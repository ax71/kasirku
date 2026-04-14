import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile } from "@/features/auth/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDeleteUser } from "../hooks/use-delete-user";

interface DialogDeleteUserProps {
  open: boolean;
  currentData?: Profile;
  onOpenChange: (open: boolean) => void;
}

export default function DialogDeleteUser({
  open,
  currentData,
  onOpenChange,
}: DialogDeleteUserProps) {
  const { mutate, isPending } = useDeleteUser();

  const onSubmit = () => {
    if (!currentData?.id) return;

    mutate(
      {
        id: currentData.id,
        avatarUrl: currentData.avatar_url ?? undefined,
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete user{" "}
          <strong>{currentData?.name}</strong>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
        </Button>
      </div>
    </DialogContent>
  );
}

