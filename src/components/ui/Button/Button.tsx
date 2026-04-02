import { cn } from "../../../utils/cn";

interface PropsTypes extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = ({
  type = "button",
  children,
  color = "primary",
  className = "",
  size = "md",
  disabled,
  ...props
}: PropsTypes) => {
  const baseStyle = "px-3 py-2 rounded-lg font-medium transition duration-200";

  const variants = {
    primary:
      "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/90",
    secondary:
      "bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground hover:bg-secondary/90 dark:hover:bg-secondary/90",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(baseStyle, variants[color], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
