import React, { forwardRef } from "react";
import { cn } from "../../../utils/cn";

interface PropsType extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  id?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, PropsType>(
  (
    {
      label,
      name,
      id,
      type = "text",
      placeholder,
      className,
      error,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const baseStyle =
      "w-full px-3 py-2 border rounded-lg text-sm transition duration-200 focus:outline-none focus:ring-2 bg-transparent";

    const variants = {
      normal: "border-border focus:ring-primary",
      error: "border-destructive focus:ring-destructive",
    };

    const disabledStyle = "opacity-50 cursor-not-allowed bg-muted";

    const inputId = id || name;

    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            baseStyle,
            error ? variants.error : variants.normal,
            disabled && disabledStyle,
            className,
          )}
          {...props}
        />

        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
