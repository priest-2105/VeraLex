
import { cn } from "../../lib/utils"
import { Check } from "lucide-react"

export const Checkbox = ({ checked, onChange, label, className, disabled = false, error, id, ...props }) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn("flex items-start", className)}>
      <div className="flex items-center h-5">
        <div
          className={cn(
            "w-4 h-4 border rounded flex items-center justify-center",
            checked ? "bg-amber-600 border-amber-600" : "bg-white",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            error ? "border-red-500" : "border-gray-300",
          )}
          onClick={() => {
            if (!disabled && onChange) {
              onChange(!checked)
            }
          }}
          {...props}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
        <input
          type="checkbox"
          className="sr-only"
          id={checkboxId}
          checked={checked}
          onChange={(e) => {
            if (!disabled && onChange) {
              onChange(e.target.checked)
            }
          }}
          disabled={disabled}
        />
      </div>
      {label && (
        <label
          htmlFor={checkboxId}
          className={cn(
            "ml-2 text-sm text-gray-700",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer",
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}

