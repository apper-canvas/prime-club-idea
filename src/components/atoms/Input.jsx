import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  type = "text",
  label,
  error,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-mint focus:border-mint",
          "transition-colors duration-200",
          error && "border-pink focus:ring-pink focus:border-pink",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;