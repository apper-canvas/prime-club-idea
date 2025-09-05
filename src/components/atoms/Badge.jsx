import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-mint to-blue text-teal-800",
    success: "bg-gradient-to-r from-green-100 to-mint text-green-800",
    warning: "bg-gradient-to-r from-peach to-yellow-200 text-amber-800",
    danger: "bg-gradient-to-r from-pink to-red-200 text-red-800",
    info: "bg-gradient-to-r from-blue to-purple text-blue-800",
    new: "bg-gradient-to-r from-mint to-blue text-teal-800",
    qualified: "bg-gradient-to-r from-blue to-purple text-blue-800",
    proposal: "bg-gradient-to-r from-peach to-yellow-200 text-amber-800",
    negotiation: "bg-gradient-to-r from-purple to-pink text-purple-800",
    won: "bg-gradient-to-r from-green-100 to-mint text-green-800",
    lost: "bg-gradient-to-r from-pink to-red-200 text-red-800"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;