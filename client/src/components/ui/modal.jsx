

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

export const Modal = ({ isOpen, onClose, children, title, size = "default", className, ...props }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  const sizes = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  }

  if (!isOpen) return null

  const ModalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className={cn("bg-white rounded-lg shadow-xl overflow-hidden w-full", sizes[size], className)}
        {...props}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )

  return typeof window !== "undefined" ? createPortal(ModalContent, document.body) : null
}

export const ModalFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Example usage:
// <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
//   <p>Modal content goes here</p>
//   <ModalFooter>
//     <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
//     <Button variant="primary">Save</Button>
//   </ModalFooter>
// </Modal>

