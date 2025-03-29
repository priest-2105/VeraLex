import { cn } from "../../lib/utils"

export const Input = ({ type = "text", label, error, className, required = false, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-amber-500 focus:ring-amber-500",
          props.disabled && "bg-gray-100 cursor-not-allowed",
          className,
        )}
        {...props}
      />
      {error && typeof error === "string" && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

