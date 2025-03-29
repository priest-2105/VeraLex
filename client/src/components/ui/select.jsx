

import { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

export const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  error = false,
  label,
  required = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === value) || null)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === value) || null)
  }, [value, options])

  const handleSelect = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
    if (onChange) {
      onChange(option.value)
    }
  }

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          className={cn(
            "flex items-center justify-between w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer hover:border-amber-300",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-amber-500",
            className,
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          {...props}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-amber-50",
                  selectedOption?.value === option.value ? "bg-amber-100 text-amber-800" : "text-gray-900",
                )}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && typeof error === "string" && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

