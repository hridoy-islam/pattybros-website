import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DynamicPaginationProps {
  pageSize: number
  setPageSize: (size: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number // Optional but highly recommended for premium UX
}

export function DynamicPagination({
  pageSize,
  setPageSize,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: DynamicPaginationProps) {
  
  // Calculate the item range being displayed
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems || 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val >= 1 && val <= totalPages) {
      onPageChange(val)
    }
  }

  return (
    <div className="p-2 flex flex-col sm:flex-row items-center justify-between gap-4   ">
      
      {/* Left section: Info & Page Size */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
        {totalItems !== undefined && (
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startItem}</span> to{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{endItem}</span> of{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalItems.toLocaleString()}</span> rows
          </span>
        )}
        
        <div className="flex items-center space-x-2">
          <p className="font-medium">Rows per page</p>
          <Select
            value={pageSize ? pageSize.toString() : ""}
            onValueChange={(value) => {
              setPageSize(Number(value))
              onPageChange(1) 
            }}
          >
            <SelectTrigger className="h-8 w-[80px] bg-white  font-medium rounded-lg shadow-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent side="top" className="rounded-lg">
              {[100, 200, 300, 400, 500, 1000].map((size) => (
                <SelectItem key={size} value={size.toString()} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right section: Navigation Controls */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        
       

        {/* Page counter display */}
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300 min-w-[90px] text-center">
          Page <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{currentPage}</span> of{" "}
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{totalPages || 1}</span>
        </div>

        {/* Arrow Button controls */}
        <div className="flex items-center space-x-1.5">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white  border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400  shadow-sm transition-colors"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white  border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400  shadow-sm transition-colors"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
          
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white  border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400  shadow-sm transition-colors"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white  border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400  shadow-sm transition-colors"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}