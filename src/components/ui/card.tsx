import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = "md", ...props }, ref) => {
    const paddingClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-lg border border-border shadow-sm",
          paddingClasses[padding],
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card };
