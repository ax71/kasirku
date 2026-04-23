import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
  categories: { value: string; label: string }[];
  activeId: string | undefined;
  onSelect: (id: string | undefined) => void;
  isLoading?: boolean;
}

export default function CategoryTabs({
  categories,
  activeId,
  onSelect,
  isLoading,
}: CategoryTabsProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <Button
          key={cat.value}
          variant={activeId === cat.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(cat.value)}
          className="shrink-0 rounded-lg transition-colors duration-200"
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
