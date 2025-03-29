import React from "react"
import { cn } from "../../utils/cn"


export const Button = ({ children, className, variant = "default", size = "default", ...props }) => {
  const baseStyles =
    "inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

  const variantStyles = {
    primary: "bg-amber-600 text-white hover:bg-amber-700 shadow",
    default: "bg-blue-800 text-white hover:bg-blue-900 shadow",
    outline: "border border-amber-600 text-amber-600 bg-transparent hover:bg-amber-500",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow",
  }

  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  }

  return (
    <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  )
}

