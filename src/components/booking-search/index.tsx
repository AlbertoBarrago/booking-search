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
import type {JSX} from "react"

/**
 * A component that provides a booking search interface. Users can select a destination, date range, and number of guests.
 * It supports both desktop and mobile layouts.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.availability - The data specifying available dates for booking.
 * @param {Array} props.locations - The list of available locations for selection.
 * @param {Function} props.onSearch - Callback function triggered when the search is submitted. Receives selected search criteria as an argument.
 * @param {Object} [props.defaultValues] - Default values for location, check-in and check-out dates, and guest count.
 * @param {string} [props.defaultValues.location] - Predefined default location value.
 * @param {Date} [props.defaultValues.checkIn] - Predefined default check-in date.
 * @param {Date} [props.defaultValues.checkOut] - Predefined default check-out date.
 * @param {number} [props.defaultValues.adults=2] - Default number of adults.
 * @param {number} [props.defaultValues.children=0] - Default number of children.
 * @param {string} [props.searchButtonText='Cerca'] - Text for the search button.
 * @param {string} [props.locationPlaceholder='Dove vuoi andare?'] - Placeholder text for the location input field.
 * @param {number} [props.minNights=1] - Minimum number of nights for the date range picker.
 * @param {number} [props.maxAdults=30] - Maximum number of adult guests allowed.
 * @param {number} [props.maxChildren=10] - Maximum number of child guests allowed.
 * @param {string} [props.className] - Additional CSS class for customizing the component style.
 *
 * @return {JSX.Element} A booking search component containing inputs for location, date range, and guest selection, along with a search button.
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
}: BookingSearchProps): JSX.Element {
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

  const [mobileOpen, setMobileOpen] = React.useState(false)

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

  const SearchContent = () => (
      <div className="flex flex-col gap-3 md:flex-row md:gap-2 md:items-center">
        <div className="flex-1 relative">
          <LocationCombobox
              locations={locations}
              value={location}
              onChange={setLocation}
              placeholder={locationPlaceholder}
              className="w-full border-0 md:rounded-l-lg md:rounded-r-none focus-visible:ring-0"
          />
          <div className="hidden md:block absolute -right-1 top-1/4 h-1/2 w-px bg-slate-200" />
        </div>

        <div className="flex-1 relative">
          <DateRangePicker
              availability={availability}
              value={dateRange}
              onChange={setDateRange}
              minNights={minNights}
              className="w-full border-0 md:rounded-none focus-visible:ring-0"
          />
          <div className="hidden md:block absolute -right-1 top-1/4 h-1/2 w-px bg-slate-200" />
        </div>

        <div className="flex-1 relative">
          <GuestSelector
              value={guests}
              onChange={setGuests}
              maxAdults={maxAdults}
              maxChildren={maxChildren}
              className="w-full border-0 md:rounded-none focus-visible:ring-0"
          />
        </div>

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

  return (
    <>
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            tabIndex={0}
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

export { LocationCombobox } from "./location-combobox"
export { DateRangePicker } from "./date-range-picker"
export { GuestSelector } from "./guest-selector"
