import { useState } from "react";
import { toast } from "sonner";
import { deleteUser } from "../services/user-service";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile } from "@/types/auth";
import DialogDelete from "./dialog-delete";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogDeleteUserProps {
  open: boolean;
  refetch: () => void;
  currentData?: Profile;
  onOpenChange: (open: boolean) => void;
}

export default function DialogDeleteUser({
  open,
  currentData,
  refetch,
  onOpenChange,
}: DialogDeleteUserProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!currentData?.id) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", currentData.id);
      formData.append("avatar_url", currentData.avatar_url || "");

      const result = await deleteUser(formData);

      if (result.status === "success") {
        toast.success("Delete User Success");
        refetch();
        onOpenChange(false);
      } else {
        toast.error(result.message || "Delete User Failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button variant="destructive" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
        </Button>
      </div>
    </DialogContent>
  );
}
