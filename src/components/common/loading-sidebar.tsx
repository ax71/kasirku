import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSidebar() {
  return (
    <div className="flex flex-col gap-2 px-2 py-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-4 py-3 rounded-md bg-muted/50"
        >
          <Skeleton className="w-5 h-5 rounded-md" />
          <Skeleton className="w-40 h-4" />
        </div>
      ))}
    </div>
  );
}
