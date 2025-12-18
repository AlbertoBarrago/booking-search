/**
 * BookingSearch Widget
 * Componente React agnostico per ricerca booking ispirato a Booking.com
 */

// Esporta il componente principale
export { BookingSearch } from "./components/booking-search"

// Esporta i sotto-componenti per uso standalone
export {
  LocationCombobox,
  DateRangePicker,
  GuestSelector,
} from "./components/booking-search"

// Esporta tutti i tipi TypeScript
export type {
  AvailabilityDay,
  Location,
  GuestData,
  BookingSearchPayload,
  BookingSearchProps,
} from "./types/booking"

// Esporta utility
export { cn } from "./lib/utils"
