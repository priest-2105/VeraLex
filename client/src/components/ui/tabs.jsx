

import { useState } from "react"
import React from "react"
import { cn } from "../../utils/cn"

export const Tabs = ({ tabs = [], activeTab, onChange, className, variant = "default", ...props }) => {
  const [activeIndex, setActiveIndex] = useState(
    activeTab !== undefined ? tabs.findIndex((tab) => tab.id === activeTab) : 0,
  )

  const handleTabChange = (index) => {
    setActiveIndex(index)
    if (onChange) {
      onChange(tabs[index].id)
    }
  }

  const variants = {
    default: {
      container: "border-b border-gray-200",
      tab: "py-2 px-4 text-sm font-medium",
      active: "text-amber-600 border-b-2 border-amber-600",
      inactive: "text-gray-500 hover:text-gray-700 hover:border-gray-300",
    },
    pills: {
      container: "space-x-2",
      tab: "py-2 px-4 text-sm font-medium rounded-md",
      active: "bg-amber-100 text-amber-800",
      inactive: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
    },
    boxed: {
      container: "border-b border-gray-200",
      tab: "py-2 px-4 text-sm font-medium border-t border-l border-r rounded-t-md -mb-px",
      active: "bg-white text-amber-600 border-gray-200",
      inactive: "bg-gray-50 text-gray-500 border-transparent hover:text-gray-700",
    },
  }

  const { container, tab, active, inactive } = variants[variant]

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className={cn("flex", container)}>
        {tabs.map((tabItem, index) => (
          <button
            key={tabItem.id}
            className={cn(tab, index === activeIndex ? active : inactive)}
            onClick={() => handleTabChange(index)}
            aria-selected={index === activeIndex}
            role="tab"
          >
            {tabItem.label}
          </button>
        ))}
      </div>
      <div className="py-4">{tabs[activeIndex] && tabs[activeIndex].content}</div>
    </div>
  )
}

// Example usage:
// const tabItems = [
//   { id: 'tab1', label: 'Tab 1', content: <div>Content for Tab 1</div> },
//   { id: 'tab2', label: 'Tab 2', content: <div>Content for Tab 2</div> },
// ];
// <Tabs tabs={tabItems} />

