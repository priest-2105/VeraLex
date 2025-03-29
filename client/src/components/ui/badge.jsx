import React from "react"
import { cn } from "../../utils/cn"

export const Badge = ({ children, variant = "default", size = "default", className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-amber-100 text-amber-800",
    secondary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    outline: "bg-transparent border border-gray-300 text-gray-700",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  }

  return (
    <span
      className={cn("inline-flex items-center font-medium rounded-full", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}

