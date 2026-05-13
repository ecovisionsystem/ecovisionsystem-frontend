import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white hover:bg-brand-secondary focus-visible:ring-brand-primary",
        secondary:
          "bg-surface-raised text-text-primary border border-border hover:bg-surface-overlay focus-visible:ring-brand-primary",
        ghost:
          "text-text-primary hover:bg-surface-overlay focus-visible:ring-brand-primary",
        destructive:
          "bg-error text-white hover:bg-red-700 focus-visible:ring-error",
      },
      size: {
        sm: "h-8 px-3 text-sm gap-2",
        md: "h-10 px-4 text-base gap-2",
        lg: "h-12 px-6 text-base gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      icon: Icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : Icon && iconPosition === "left" ? (
          <Icon className="h-4 w-4" />
        ) : null}
        {children}
        {Icon && iconPosition === "right" && !loading && (
          <Icon className="h-4 w-4" />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
