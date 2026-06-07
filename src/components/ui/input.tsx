import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { T } from "@/styles/style";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  focused?: boolean;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, focused, error }, ref, ...props) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-border bg-surface px-3 py-2 text-base placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
        style={{
          boxShadow: focused ? `0 0 0 3px ${T.leaf}18` : "none",
          transition: "border-color .2s, box-shadow .2s",
          border: `1.5px solid ${error ? T.ember : focused ? T.moss : T.bark}`,
        }}
      />
    );
  },
);

const InputLogin = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div>
        <input
          type={type}
          className={cn(
            "block w-full pl-10 pr-3 py-3 border border-[#1A1A1A] bg-transparent font-display italic text-sm placeholder-[#1A1A1A]/40 focus:outline-none focus:bg-[#EBEBE3]/50 transition-colors",
            className,
          )}
          ref={ref}
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            boxShadow: focused ? `0 0 0 3px ${T.leaf}18` : "none",
            transition: "border-color .2s, box-shadow .2s",
            border: `1.5px solid ${error ? T.ember : focused ? T.moss : T.bark}`,
            outline: "none",
            color: T.ink,
            borderRadius: 7,
          }}
        />
        {error && <p className="mt-1 text-xs text-ember">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
InputLogin.displayName = "InputLogin";

export { Input, InputLogin };
