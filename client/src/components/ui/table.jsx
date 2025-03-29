import { cn } from "../../lib/utils"

export const Table = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={cn("w-full text-sm text-left text-gray-700", className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={cn("text-xs text-gray-700 uppercase bg-gray-50", className)} {...props}>
      {children}
    </thead>
  )
}

export const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  )
}

export const TableRow = ({ children, className, ...props }) => {
  return (
    <tr className={cn("bg-white border-b hover:bg-gray-50", className)} {...props}>
      {children}
    </tr>
  )
}

export const TableHead = ({ children, className, ...props }) => {
  return (
    <th className={cn("px-6 py-3 font-medium", className)} {...props}>
      {children}
    </th>
  )
}

export const TableCell = ({ children, className, ...props }) => {
  return (
    <td className={cn("px-6 py-4", className)} {...props}>
      {children}
    </td>
  )
}

export const TableFooter = ({ children, className, ...props }) => {
  return (
    <tfoot className={cn("text-xs text-gray-700 uppercase bg-gray-50", className)} {...props}>
      {children}
    </tfoot>
  )
}

