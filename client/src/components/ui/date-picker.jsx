

import { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

export const DatePicker = ({
  value,
  onChange,
  label,
  placeholder = "Select a date",
  className,
  disabled = false,
  error,
  minDate,
  maxDate,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date())
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const datePickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
      setCurrentMonth(new Date(value))
    } else {
      setSelectedDate(null)
    }
  }, [value])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setIsOpen(false)
    if (onChange) {
      onChange(date)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true
    if (maxDate && date > new Date(maxDate)) return true
    return false
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      const isToday = new Date().toDateString() === date.toDateString()
      const disabled = isDateDisabled(date)

      days.push(
        <button
          key={day}
          type="button"
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm",
            isSelected && "bg-amber-600 text-white",
            !isSelected && isToday && "border border-amber-600 text-amber-600",
            !isSelected && !isToday && !disabled && "hover:bg-gray-100",
            disabled && "text-gray-300 cursor-not-allowed",
          )}
          onClick={() => !disabled && handleDateSelect(date)}
          disabled={disabled}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="w-full" ref={datePickerRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <div
          className={cn(
            "flex items-center w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm",
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer hover:border-amber-300",
            error ? "border-red-500" : "border-gray-300",
            className,
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button type="button" className="p-1 hover:bg-gray-100 rounded-full" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="font-medium">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
              <button type="button" className="p-1 hover:bg-gray-100 rounded-full" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>
        )}
      </div>

      {error && typeof error === "string" && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

