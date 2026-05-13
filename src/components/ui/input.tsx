import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-md border border-border bg-surface px-3 py-2 text-base placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
const InputLogin = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "block w-full pl-10 pr-3 py-3 border border-[#1A1A1A] bg-transparent font-display italic text-sm placeholder-[#1A1A1A]/40 focus:outline-none focus:bg-[#EBEBE3]/50 transition-colors",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = "Input";
InputLogin.displayName = "InputLogin";

export { Input, InputLogin };
