import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function DropdownActions({
  menu,
}: {
  menu: {
    label: string | React.ReactNode;
    variant?: "default" | "destructive";
    type?: "button" | "link";
    action?: () => void;
  }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-muted-foreground/10 size-8"
          size="icon"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {menu.map((item, index) => (
          <DropdownMenuItem
            key={index}
            asChild={item.type === "link"}
            variant={item.variant}
            onClick={item.action}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
