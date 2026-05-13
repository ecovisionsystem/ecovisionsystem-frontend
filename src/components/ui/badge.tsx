import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-muted text-brand-primary",
        success: "bg-success-bg text-success",
        warning: "bg-warning-bg text-warning",
        error: "bg-error-bg text-error",
        info: "bg-info-bg text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
