import { useMemo } from "react";

// We can accept either CartItem[] (from POS before save)
// or OrderMenu[] (from database order detail) as long as it has `nominal`
export function usePricing(items: { nominal: number }[] | null | undefined) {
  const safeItems = items || [];

  return useMemo(() => {
    const totalPrice = safeItems.reduce((acc, item) => acc + item.nominal, 0);
    const tax = Math.round(totalPrice * 0.12);
    const service = Math.round(totalPrice * 0.05);
    const grandTotal = totalPrice + tax + service;

    return { totalPrice, tax, service, grandTotal };
  }, [safeItems]);
}
