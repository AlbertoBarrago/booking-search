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
  const [localValue, setLocalValue] = React.useState(value)

  React.useEffect(() => {
    if (open) {
      setLocalValue(value)
    }
  }, [open, value])

  const availabilityMap = React.useMemo(() => {
    const map = new Map<string, AvailabilityDay>()
    availability.forEach((day) => {
      map.set(day.date, day)
    })
    return map
  }, [availability])

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

    if (!localValue.from || (localValue.from && localValue.to)) {
      setLocalValue({ from: day, to: null })
    } else {
      if (day < localValue.from) {
        setLocalValue({ from: day, to: localValue.from })
      } else {
        setLocalValue({ from: localValue.from, to: day })
      }
    }
  }

  const handleConfirm = () => {
    onChange(localValue)
    setOpen(false)
  }

  const handleCancel = () => {
    setLocalValue(value)
    setOpen(false)
  }

  const renderDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd")
    const dayData = availabilityMap.get(dateStr)

    return (
      <div className="flex flex-col items-center justify-center">
        <span>{format(day, "d")}</span>
        {dayData && dayData.isAvailable && (
          <span className="text-[10px] font-semibold text-slate-600 leading-none mt-0.5">
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

  const formatLocalDateRange = () => {
    if (localValue.from && localValue.to) {
      const nights = differenceInDays(localValue.to, localValue.from)
      return `${nights} ${nights === 1 ? 'notte' : 'notti'}`
    }
    if (localValue.from) {
      return "Seleziona check-out"
    }
    return "Seleziona le date"
  }

  const getNights = () => {
    if (value.from && value.to) {
      return differenceInDays(value.to, value.from)
    }
    return 0
  }

  const modifiers: Record<string, Date | Date[]> = {
    disabled: disabledDays,
  }

  if (localValue.from) {
    modifiers.start = localValue.from
  }

  if (localValue.to) {
    modifiers.end = localValue.to
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
      <PopoverContent
        className="w-auto p-0 shadow-2xl"
        align="start"
        sideOffset={8}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <div className="p-4">
          <DayPicker
            mode="range"
            defaultMonth={localValue.from || new Date()}
            selected={{
              from: localValue.from || undefined,
              to: localValue.to || undefined,
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

          <div className="border-t border-slate-200 p-4 space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                {formatLocalDateRange()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!localValue.from || !localValue.to}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
