import { useMemo } from "react";

// We can accept either CartItem[] (from POS before save)
// or OrderMenu[] (from database order detail) as long as it has `nominal`
export function usePricing(items: { nominal: number }[] | null | undefined) {
  const safeItems = items || [];

  const totalPrice = useMemo(() => {
    let total = 0;
    safeItems.forEach((item) => {
      total += item.nominal;
    });
    return total;
  }, [safeItems]);

  const tax = useMemo(() => {
    return Math.round(totalPrice * 0.12);
  }, [totalPrice]);

  const service = useMemo(() => {
    return Math.round(totalPrice * 0.05);
  }, [totalPrice]);

  const grandTotal = useMemo(() => {
    return totalPrice + tax + service;
  }, [totalPrice, tax, service]);

  return {
    totalPrice,
    tax,
    service,
    grandTotal,
  };
}
