import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { convertIDR } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { MenuItem } from "@/features/menu/types";

interface CardMenuProps {
  menu: MenuItem;
  onAddToCart: (item: MenuItem, action: "increment" | "decrement") => void;
}

export default function CardMenu({ menu, onAddToCart }: CardMenuProps) {
  const discountedPrice =
    (menu.discount ?? 0) > 0
      ? menu.price - menu.price * ((menu.discount ?? 0) / 100)
      : menu.price;

  return (
    <Card className="w-full flex flex-col justify-between border shadow-sm p-0 gap-0">
      <CardContent className="p-0">
        {menu.image_url ? (
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full aspect-square object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full aspect-square bg-slate-100 rounded-t-lg flex items-center justify-center text-slate-400 text-2xl font-bold">
            {menu.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="px-4 py-2">
          <h3 className="text-lg font-semibold line-clamp-1">{menu.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {menu.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <div>
          {(menu.discount ?? 0) > 0 && (
            <div className="text-sm line-through text-muted-foreground">
              {convertIDR(menu.price)}
            </div>
          )}
          <div className="text-sm font-bold">{convertIDR(discountedPrice)}</div>
        </div>
        <Button
          className="cursor-pointer"
          onClick={() => onAddToCart(menu, "increment")}
        >
          <ShoppingCart />
        </Button>
      </CardFooter>
    </Card>
  );
}
