import * as React from "react"
import { DayPicker } from "react-day-picker"
import { format, parseISO, differenceInDays } from "date-fns"
import { it } from "date-fns/locale"
import { Calendar } from "lucide-react"
import { cn } from "../../lib/utils"
import type { AvailabilityDay } from "../../types/booking"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import "react-day-picker/dist/style.css"

interface DateRangePickerProps {
  availability: AvailabilityDay[]
  value: { from: Date | null; to: Date | null }
  onChange: (range: { from: Date | null; to: Date | null }) => void
  minNights?: number
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  availability,
  value,
  onChange,
  minNights = 1,
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Create a map for fast access to availability data
  const availabilityMap = React.useMemo(() => {
    const map = new Map<string, AvailabilityDay>()
    availability.forEach((day) => {
      map.set(day.date, day)
    })
    return map
  }, [availability])

  // Determine which days are disabled
  const disabledDays = React.useMemo(() => {
    const disabled: Date[] = []
    availability.forEach((day) => {
      if (!day.isAvailable) {
        disabled.push(parseISO(day.date))
      }
    })
    return disabled
  }, [availability])

  const handleDayClick = (day: Date) => {
    console.log("🖱️ Day clicked:", day)

    if (!value.from || (value.from && value.to)) {
      // First click or reset
      console.log("📍 Setting start date")
      onChange({ from: day, to: null })
    } else {
      // Second click
      if (day < value.from) {
        // Click on earlier date, reverse
        console.log("🔄 Reversing dates")
        onChange({ from: day, to: value.from })
        setOpen(false) // Close after complete selection
      } else {
        console.log("✅ Setting end date")
        onChange({ from: value.from, to: day })
        setOpen(false) // Close after complete selection
      }
    }
  }

  // Custom day render to show prices
  const renderDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd")
    const dayData = availabilityMap.get(dateStr)

    return (
      <div className="flex flex-col items-center justify-center">
        <span>{format(day, "d")}</span>
        {dayData && dayData.isAvailable && (
          <span className="text-[10px] font-bold text-blue-600 leading-none">
            €{dayData.price}
          </span>
        )}
      </div>
    )
  }

  const formatDateRange = () => {
    if (value.from && value.to) {
      return `${format(value.from, "dd MMM", { locale: it })} - ${format(value.to, "dd MMM", { locale: it })}`
    }
    if (value.from) {
      return format(value.from, "dd MMM yyyy", { locale: it })
    }
    return "Seleziona date"
  }

  const getNights = () => {
    if (value.from && value.to) {
      return differenceInDays(value.to, value.from)
    }
    return 0
  }

  // Modifiers for styling
  const modifiers: Record<string, Date | Date[]> = {
    disabled: disabledDays,
  }

  if (value.from) {
    modifiers.start = value.from
  }

  if (value.to) {
    modifiers.end = value.to
  }

  const modifiersClassNames = {
    start: "rdp-day_range_start",
    end: "rdp-day_range_end",
    disabled: "rdp-day_disabled",
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Seleziona date"
          disabled={disabled}
          className={cn(
            "flex h-14 w-full items-center gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm transition-all hover:bg-slate-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 relative",
            open
              ? "border-blue-500 ring-2 ring-blue-500 shadow-lg z-10"
              : "border-slate-300",
            className
          )}
        >
          <Calendar className="h-5 w-5 text-slate-500 flex-shrink-0" aria-hidden="true" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-slate-500">
              Check-in - Check-out
            </span>
            <span
              className={cn(
                "font-medium truncate",
                value.from ? "text-slate-900" : "text-slate-400"
              )}
            >
              {formatDateRange()}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-2xl" align="start" sideOffset={8}>
        <div className="p-4">
          <DayPicker
            mode="range"
            defaultMonth={value.from || new Date()}
            selected={{
              from: value.from || undefined,
              to: value.to || undefined,
            }}
            onDayClick={handleDayClick}
            disabled={disabledDays}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            locale={it}
            numberOfMonths={2}
            className="rdp-custom"
            formatters={{
              formatDay: renderDay,
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
