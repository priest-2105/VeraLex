import React from "react"
import { cn } from "../../utils/cn"


export const Card = ({ children, className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-white border border-gray-200",
    primary: "bg-amber-50 border border-amber-200",
    secondary: "bg-blue-50 border border-blue-200",
    outline: "bg-transparent border border-gray-300",
  }

  return (
    <div className={cn("rounded-lg shadow-sm overflow-hidden", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-200", className)} {...props}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={cn("text-lg font-medium text-gray-900", className)} {...props}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={cn("mt-1 text-sm text-gray-500", className)} {...props}>
      {children}
    </p>
  )
}

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn("px-6 py-4 bg-gray-50 border-t border-gray-200", className)} {...props}>
      {children}
    </div>
  )
}

