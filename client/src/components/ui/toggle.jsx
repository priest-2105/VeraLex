
import { cn } from "../../lib/utils"

export const Toggle = ({ checked, onChange, label, className, disabled = false, size = "default", ...props }) => {
  const sizes = {
    sm: "w-8 h-4",
    default: "w-10 h-5",
    lg: "w-12 h-6",
  }

  const knobSizes = {
    sm: "w-3 h-3",
    default: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const knobTranslate = {
    sm: "translate-x-4",
    default: "translate-x-5",
    lg: "translate-x-6",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        className={cn(
          "relative inline-flex flex-shrink-0 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500",
          sizes[size],
          checked ? "bg-amber-600" : "bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        role="switch"
        aria-checked={checked}
        onClick={() => {
          if (!disabled && onChange) {
            onChange(!checked)
          }
        }}
        disabled={disabled}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
            knobSizes[size],
            checked ? knobTranslate[size] : "translate-x-0",
          )}
        />
      </button>
      {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
    </div>
  )
}

