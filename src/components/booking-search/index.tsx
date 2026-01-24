import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import type { BookingSearchProps, SearchLocation, GuestData, BookingSearchTranslations } from "../../types/booking"
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

/** Default translations (English) */
const defaultTranslations: Required<BookingSearchTranslations> = {
  // Location strings
  destination: "Destination",
  whereToGo: "Where do you want to go?",
  searchDestination: "Search a destination...",
  noLocationFound: "No location found.",
  // Date picker strings
  checkInCheckOut: "Check-in - Check-out",
  selectDateRange: "Select Date Range",
  night: "night",
  nights: "nights",
  selectCheckOut: "Select check-out",
  selectCheckOutMin: "Select check-out (min. {minNights} nights)",
  // Guest selector strings
  guests: "Guests",
  adults: "Adults",
  adultsDescription: "Age 18+",
  children: "Children",
  childrenDescription: "Age 0-17",
  adult: "adult",
  adultsPlural: "adults",
  child: "child",
  childrenPlural: "children",
  guest: "guest",
  guestsPlural: "guests",
  // Button strings
  confirm: "Confirm",
  cancel: "Cancel",
  search: "Search",
  // Dialog strings
  searchAccommodation: "Search your accommodation",
  openSearch: "Open booking search",
}

/**
 * A component that provides a booking search interface. Users can select a destination, date range, and number of guests.
 * It supports both desktop and mobile layouts.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.availability - The data specifying available dates for booking.
 * @param {Array} props.locations - The list of available locations for selection.
 * @param {Function} props.onSearch - Callback function triggered when the search is submitted. Receives selected search criteria as an argument.
 * @param {Object} [props.defaultValues] - Default values for location, check-in and check-out dates, and guest count.
 * @param {string} [props.searchButtonText='Search'] - Text for the search button. @deprecated Use translations.search instead.
 * @param {string} [props.locationPlaceholder='Where do you want to go?'] - Placeholder text for the location input field. @deprecated Use translations.whereToGo instead.
 * @param {number} [props.minNights=1] - Minimum number of nights for the date range picker.
 * @param {number} [props.maxAdults=30] - Maximum number of adult guests allowed.
 * @param {number} [props.maxChildren=10] - Maximum number of child guests allowed.
 * @param {string} [props.className] - Additional CSS class for customizing the component style.
 * @param {BookingSearchTranslations} [props.translations] - Custom translations for all UI strings.
 *
 * @return {JSX.Element} A booking search component containing inputs for location, date range, and guest selection, along with a search button.
 */
export function BookingSearch({
  availability,
  locations,
  onSearch,
  defaultValues,
  searchButtonText,
  locationPlaceholder,
  minNights = 1,
  maxAdults = 30,
  maxChildren = 10,
  className,
  translations: userTranslations,
}: BookingSearchProps): JSX.Element {
  // Merge user translations with defaults
  const t = React.useMemo(() => ({
    ...defaultTranslations,
    ...userTranslations,
    // Support deprecated props for backwards compatibility
    ...(searchButtonText && { search: searchButtonText }),
    ...(locationPlaceholder && { whereToGo: locationPlaceholder }),
  }), [userTranslations, searchButtonText, locationPlaceholder])
  const [location, setLocation] = React.useState<SearchLocation | null>(
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
        <div className="flex-1 relative focus-within:z-10">
          <LocationCombobox
              locations={locations}
              value={location}
              onChange={setLocation}
              className="w-full border-0 md:rounded-l-lg md:rounded-r-none"
              tabIndex={1}
              translations={{
                destination: t.destination,
                whereToGo: t.whereToGo,
                searchDestination: t.searchDestination,
                noLocationFound: t.noLocationFound,
              }}
          />
        </div>

        <div className="flex-1 relative focus-within:z-10">
          <DateRangePicker
              availability={availability}
              value={dateRange}
              onChange={setDateRange}
              minNights={minNights}
              className="w-full border-0 md:rounded-none"
              tabIndex={2}
              translations={{
                checkInCheckOut: t.checkInCheckOut,
                selectDateRange: t.selectDateRange,
                night: t.night,
                nights: t.nights,
                selectCheckOut: t.selectCheckOut,
                selectCheckOutMin: t.selectCheckOutMin,
                confirm: t.confirm,
                cancel: t.cancel,
              }}
          />
        </div>

        <div className="flex-1 relative focus-within:z-10">
          <GuestSelector
              value={guests}
              onChange={setGuests}
              maxAdults={maxAdults}
              maxChildren={maxChildren}
              className="w-full border-0 md:rounded-none"
              tabIndex={3}
              translations={{
                guests: t.guests,
                adults: t.adults,
                adultsDescription: t.adultsDescription,
                children: t.children,
                childrenDescription: t.childrenDescription,
                adult: t.adult,
                adultsPlural: t.adultsPlural,
                child: t.child,
                childrenPlural: t.childrenPlural,
                confirm: t.confirm,
              }}
          />
        </div>

        <div className="md:pl-2">
          <button
              type="button"
              onClick={handleSearch}
              disabled={!isSearchEnabled}
              aria-label={t.search}
              tabIndex={4}
              className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-bold text-white transition-all hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:shadow-lg disabled:bg-slate-300 md:w-auto",
              )}
          >
            <Search className="h-4 w-4" />
            <span className="whitespace-nowrap">{t.search}</span>
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
            aria-label={t.openSearch}
          >
            <Search className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-slate-900">
                {t.whereToGo}
              </span>
              <span className="text-xs text-slate-500">
                {location?.name ?? t.destination} • {guests.adults + guests.children}{" "}
                {guests.adults + guests.children === 1 ? t.guest : t.guestsPlural}
              </span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t.searchAccommodation}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 pb-safe">
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
