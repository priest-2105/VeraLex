
import { cn } from "../../lib/utils"

export const Radio = ({
  options = [],
  value,
  onChange,
  label,
  className,
  disabled = false,
  error,
  inline = false,
  name,
  ...props
}) => {
  const radioName = name || `radio-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn("w-full", className)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className={cn("space-y-2", inline && "flex space-y-0 space-x-6")}>
        {options.map((option) => {
          const optionId = `${radioName}-${option.value}`
          return (
            <div key={option.value} className="flex items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center",
                  value === option.value ? "border-amber-600" : "border-gray-300",
                  disabled && "opacity-50 cursor-not-allowed",
                )}
              >
                {value === option.value && <div className="w-2 h-2 rounded-full bg-amber-600" />}
              </div>
              <input
                type="radio"
                id={optionId}
                name={radioName}
                value={option.value}
                checked={value === option.value}
                onChange={() => {
                  if (!disabled && onChange) {
                    onChange(option.value)
                  }
                }}
                className="sr-only"
                disabled={disabled}
                {...props}
              />
              <label
                htmlFor={optionId}
                className={cn(
                  "ml-2 text-sm text-gray-700",
                  disabled && "opacity-50 cursor-not-allowed",
                  !disabled && "cursor-pointer",
                )}
              >
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
      {error && typeof error === "string" && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

