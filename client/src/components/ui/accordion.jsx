

import { useState } from "react"
import React from "react"
import { cn } from "../../utils/cn"
import { ChevronDown } from "lucide-react"

export const AccordionItem = ({ title, children, isOpen, onToggle, className, ...props }) => {
  return (
    <div className={cn("border border-gray-200 rounded-md overflow-hidden", className)} {...props}>
      <button
        className="flex justify-between items-center w-full px-4 py-3 text-left bg-white hover:bg-gray-50 focus:outline-none"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown className={cn("h-5 w-5 text-gray-500 transition-transform", isOpen && "transform rotate-180")} />
      </button>
      {isOpen && <div className="px-4 py-3 border-t border-gray-200 bg-white">{children}</div>}
    </div>
  )
}

export const Accordion = ({ items = [], allowMultiple = false, defaultOpen = [], className, ...props }) => {
  const [openItems, setOpenItems] = useState(defaultOpen)

  const handleToggle = (index) => {
    if (allowMultiple) {
      setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openItems.includes(index)}
          onToggle={() => handleToggle(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

// Example usage:
// const accordionItems = [
//   { title: 'Section 1', content: <p>Content for section 1</p> },
//   { title: 'Section 2', content: <p>Content for section 2</p> },
// ];
// <Accordion items={accordionItems} />

