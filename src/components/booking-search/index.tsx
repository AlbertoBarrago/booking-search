import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import type { BookingSearchProps, Location, GuestData } from "../../types/booking"
import { LocationCombobox } from "./location-combobox"
import { DateRangePicker } from "./date-range-picker"
import { GuestSelector } from "./guest-selector"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

/**
 * Main component for booking search
 * Inspired by Booking.com search bar
 */
export function BookingSearch({
  availability,
  locations,
  onSearch,
  defaultValues,
  searchButtonText = "Cerca",
  locationPlaceholder = "Dove vuoi andare?",
  minNights = 1,
  maxAdults = 30,
  maxChildren = 10,
  className,
}: BookingSearchProps) {
  // Component state
  const [location, setLocation] = React.useState<Location | null>(
    defaultValues?.location ?? null
  )
  const [dateRange, setDateRange] = React.useState<{
    from: Date | null
    to: Date | null
  }>({
    from: defaultValues?.checkIn ?? null,
    to: defaultValues?.checkOut ?? null,
  })
  const [guests, setGuests] = React.useState<GuestData>({
    adults: defaultValues?.adults ?? 2,
    children: defaultValues?.children ?? 0,
  })

  // State for mobile dialog
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Media query to detect mobile
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSearch = () => {
    onSearch({
      location,
      checkIn: dateRange.from,
      checkOut: dateRange.to,
      adults: guests.adults,
      children: guests.children,
    })
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isSearchEnabled = location && dateRange.from && dateRange.to

  // Form content (shared between desktop and mobile)
  const SearchContent = () => (
      <div className="flex flex-col gap-3 md:flex-row md:gap-2 md:items-center">
        {/* Destination */}
        <div className="flex-1 relative">
          <LocationCombobox
              locations={locations}
              value={location}
              onChange={setLocation}
              placeholder={locationPlaceholder}
              className="w-full border-0 md:rounded-l-lg md:rounded-r-none focus-visible:ring-0"
          />
          {/* Vertical Divider */}
          <div className="hidden md:block absolute -right-1 top-1/4 h-1/2 w-px bg-slate-200" />
        </div>

        {/* Check-in & Check-out */}
        <div className="flex-1 relative">
          <DateRangePicker
              availability={availability}
              value={dateRange}
              onChange={setDateRange}
              minNights={minNights}
              className="w-full border-0 md:rounded-none focus-visible:ring-0"
          />
          {/* Vertical Divider */}
          <div className="hidden md:block absolute -right-1 top-1/4 h-1/2 w-px bg-slate-200" />
        </div>

        {/* Ospiti (Guests) */}
        <div className="flex-1 relative">
          <GuestSelector
              value={guests}
              onChange={setGuests}
              maxAdults={maxAdults}
              maxChildren={maxChildren}
              className="w-full border-0 md:rounded-none focus-visible:ring-0"
          />
        </div>

        {/* Search Button */}
        <div className="md:pl-2">
          <button
              type="button"
              onClick={handleSearch}
              disabled={!isSearchEnabled}
              aria-label={searchButtonText}
              className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:bg-slate-300 md:w-auto",
              )}
          >
            <Search className="h-4 w-4" />
            <span className="whitespace-nowrap">{searchButtonText}</span>
          </button>
        </div>
      </div>
  )

  // Desktop render (always visible)
  if (!isMobile) {
    return (
      <div
        className={cn(
          "w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-xl",
          className
        )}
        role="search"
        aria-label="Booking search"
      >
        <SearchContent />
      </div>
    )
  }

  // Mobile render (in a Dialog)
  return (
    <>
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-14 w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 shadow-md",
              className
            )}
            aria-label="Open booking search"
          >
            <Search className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-slate-900">
                Dove vuoi andare?
              </span>
              <span className="text-xs text-slate-500">
                {location?.name ?? "Destinazione"} • {guests.adults + guests.children}{" "}
                {guests.adults + guests.children === 1 ? "ospite" : "ospiti"}
              </span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search your accommodation</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <SearchContent />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Export sub-components for standalone use
export { LocationCombobox } from "./location-combobox"
export { DateRangePicker } from "./date-range-picker"
export { GuestSelector } from "./guest-selector"
