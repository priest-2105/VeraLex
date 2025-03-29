

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import React from "react"
import { cn } from "../../utils/cn"

export const Tooltip = ({ children, content, position = "top", delay = 0, className, ...props }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft

    let top, left

    switch (position) {
      case "top":
        top = triggerRect.top + scrollTop - tooltipRect.height - 8
        left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case "bottom":
        top = triggerRect.bottom + scrollTop + 8
        left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case "left":
        top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8
        break
      case "right":
        top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.right + scrollLeft + 8
        break
      default:
        top = triggerRect.top + scrollTop - tooltipRect.height - 8
        left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 0) left = 0
    if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width
    if (top < 0) top = 0
    if (top + tooltipRect.height > viewportHeight + scrollTop) top = viewportHeight + scrollTop - tooltipRect.height

    setTooltipPosition({ top, left })
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setTimeout(calculatePosition, 0)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      window.addEventListener("resize", calculatePosition)
      window.addEventListener("scroll", calculatePosition)
    }

    return () => {
      window.removeEventListener("resize", calculatePosition)
      window.removeEventListener("scroll", calculatePosition)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isVisible])

  const tooltipStyles = {
    position: "absolute",
    top: `${tooltipPosition.top}px`,
    left: `${tooltipPosition.left}px`,
    zIndex: 1000,
  }

  return (
    <>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="inline-block">
        {children}
      </div>

      {isVisible &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            style={tooltipStyles}
            className={cn("px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm", className)}
            {...props}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}

