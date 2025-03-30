

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






// import React from "react"
// import { cn } from "../../lib/utils"

// export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     className={cn(
//       "inline-flex items-center justify-center rounded-md p-1 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[orientation=horizontal]:space-x-1 data-[orientation=vertical]:space-y-1",
//       className,
//     )}
//     ref={ref}
//     role="tablist"
//     {...props}
//   />
// ))
// TabsList.displayName = "TabsList"

// export const TabsTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
//   <button
//     className={cn(
//       "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 hover:bg-amber-50",
//       className,
//     )}
//     ref={ref}
//     role="tab"
//     aria-selected={props["data-state"] === "active"}
//     {...props}
//   >
//     {children}
//   </button>
// ))
// TabsTrigger.displayName = "TabsTrigger"

// export const TabsContent = React.forwardRef(({ className, children, ...props }, ref) => (
//   <div
//     className={cn(
//       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
//       className,
//     )}
//     ref={ref}
//     role="tabpanel"
//     {...props}
//   >
//     {children}
//   </div>
// ))
// TabsContent.displayName = "TabsContent"

// export const Tabs = ({ children }) => {
//   return <>{children}</>
// }

