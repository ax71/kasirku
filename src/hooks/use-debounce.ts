import { useRef } from "react";

export default function useDebounce() {
  const debaounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (func: () => void, delay: number) => {
    if (debaounceTimeout.current) clearTimeout(debaounceTimeout.current);

    debaounceTimeout.current = setTimeout(() => {
      func();
      debaounceTimeout.current = null;
    }, delay);
  };

  return debounce;
}
