import * as React from "react"
import { Users, Minus, Plus } from "lucide-react"
import { cn } from "../../lib/utils"
import type { GuestData } from "../../types/booking"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface GuestSelectorProps {
  value: GuestData
  onChange: (guests: GuestData) => void
  maxAdults?: number
  maxChildren?: number
  disabled?: boolean
  className?: string
}

interface GuestStepperProps {
  label: string
  description?: string
  value: number
  onIncrement: () => void
  onDecrement: () => void
  min?: number
  max?: number
}

function GuestStepper({
  label,
  description,
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
}: GuestStepperProps) {
  const canDecrement = value > min
  const canIncrement = value < max

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">{label}</span>
        {description && (
          <span className="text-xs text-slate-500">{description}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-300 disabled:hover:bg-transparent"
          )}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span
          className="w-8 text-center text-sm font-medium text-slate-900"
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label={`Increase ${label.toLowerCase()}`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:hover:bg-slate-300"
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export function GuestSelector({
  value,
  onChange,
  maxAdults = 30,
  maxChildren = 10,
  disabled = false,
  className,
}: GuestSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const handleAdultsChange = (delta: number) => {
    const newValue = Math.max(1, Math.min(maxAdults, value.adults + delta))
    onChange({ ...value, adults: newValue })
  }

  const handleChildrenChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(maxChildren, value.children + delta))
    onChange({ ...value, children: newValue })
  }

  const formatGuestText = () => {
    const parts: string[] = []

    if (value.adults === 1) {
      parts.push("1 adulto")
    } else {
      parts.push(`${value.adults} adulti`)
    }

    if (value.children > 0) {
      if (value.children === 1) {
        parts.push("1 bambino")
      } else {
        parts.push(`${value.children} bambini`)
      }
    }

    return parts.join(", ")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Seleziona ospiti"
          disabled={disabled}
          className={cn(
            "flex h-14 w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <Users className="h-5 w-5 text-slate-500 flex-shrink-0" aria-hidden="true" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-slate-500">Ospiti</span>
            <span className="font-medium text-slate-900 truncate">{formatGuestText()}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px]" align="start">
        <div className="space-y-1">
          <GuestStepper
            label="Adulti"
            description="Età 18+"
            value={value.adults}
            onIncrement={() => handleAdultsChange(1)}
            onDecrement={() => handleAdultsChange(-1)}
            min={1}
            max={maxAdults}
          />
          <div className="border-t border-slate-200" />
          <GuestStepper
            label="Bambini"
            description="Età 0-17"
            value={value.children}
            onIncrement={() => handleChildrenChange(1)}
            onDecrement={() => handleChildrenChange(-1)}
            min={0}
            max={maxChildren}
          />
          <div className="border-t border-slate-200 mt-3" />
          <div className="pt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Conferma
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
