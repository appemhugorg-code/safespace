import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date
    onDateChange?: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    minDate?: Date
    maxDate?: Date
    availableDates?: string[] // Array of date strings in 'YYYY-MM-DD' format
}

export function DatePicker({
    date,
    onDateChange,
    placeholder = "Pick a date",
    disabled = false,
    className,
    minDate,
    maxDate,
    availableDates,
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onDateChange}
                    disabled={(date) => {
                        const dateStr = format(date, 'yyyy-MM-dd')
                        
                        if (minDate && date < minDate) {
                            console.log(`${dateStr}: disabled (before minDate)`)
                            return true
                        }
                        if (maxDate && date > maxDate) {
                            console.log(`${dateStr}: disabled (after maxDate)`)
                            return true
                        }
                        
                        // If availableDates is provided, only allow those dates
                        if (availableDates && availableDates.length > 0) {
                            const isAvailable = availableDates.includes(dateStr)
                            console.log(`${dateStr}: ${isAvailable ? 'ENABLED' : 'disabled'} (availableDates: ${JSON.stringify(availableDates)})`)
                            return !isAvailable
                        }
                        
                        console.log(`${dateStr}: ENABLED (no restrictions)`)
                        return false
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}