
import { cn } from "../../lib/utils"
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react"

export const Alert = ({ children, title, variant = "info", className, onClose, ...props }) => {
  const variants = {
    info: {
      containerClass: "bg-blue-50 border-blue-200",
      iconClass: "text-blue-800",
      titleClass: "text-blue-800",
      textClass: "text-blue-700",
      Icon: Info,
    },
    success: {
      containerClass: "bg-green-50 border-green-200",
      iconClass: "text-green-800",
      titleClass: "text-green-800",
      textClass: "text-green-700",
      Icon: CheckCircle,
    },
    warning: {
      containerClass: "bg-amber-50 border-amber-200",
      iconClass: "text-amber-800",
      titleClass: "text-amber-800",
      textClass: "text-amber-700",
      Icon: AlertTriangle,
    },
    error: {
      containerClass: "bg-red-50 border-red-200",
      iconClass: "text-red-800",
      titleClass: "text-red-800",
      textClass: "text-red-700",
      Icon: AlertCircle,
    },
  }

  const { containerClass, iconClass, titleClass, textClass, Icon } = variants[variant]

  return (
    <div className={cn("p-4 border rounded-md relative", containerClass, className)} role="alert" {...props}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn("h-5 w-5", iconClass)} />
        </div>
        <div className="ml-3">
          {title && <h3 className={cn("text-sm font-medium", titleClass)}>{title}</h3>}
          <div className={cn("text-sm", textClass)}>{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={cn(
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  `text-${variant}-500 hover:bg-${variant}-100 focus:ring-${variant}-600`,
                )}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

