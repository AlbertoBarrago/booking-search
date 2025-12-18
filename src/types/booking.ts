/**
 * Represents availability and price for a single day
 */
export interface AvailabilityDay {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Price for this date */
  price: number;
  /** Whether the date is available for booking */
  isAvailable: boolean;
}

/**
 * Selectable location
 */
export interface Location {
  id: string;
  name: string;
  /** Type of location (city, hotel, region, etc.) */
  type?: string;
  /** ISO country code */
  countryCode?: string;
}

/**
 * Guest data
 */
export interface GuestData {
  adults: number;
  children: number;
}

/**
 * Payload emitted by the component when user performs a search
 */
export interface BookingSearchPayload {
  /** Selected location */
  location: Location | null;
  /** Check-in date */
  checkIn: Date | null;
  /** Check-out date */
  checkOut: Date | null;
  /** Number of adults */
  adults: number;
  /** Number of children */
  children: number;
}

/**
 * Props for the main BookingSearch component
 */
export interface BookingSearchProps {
  /** Availability and prices for dates */
  availability: AvailabilityDay[];
  /** List of available locations for search */
  locations: Location[];
  /** Callback called when user initiates a search */
  onSearch: (payload: BookingSearchPayload) => void;
  /** Initial values (optional) */
  defaultValues?: Partial<BookingSearchPayload>;
  /** Search button text */
  searchButtonText?: string;
  /** Placeholder for location field */
  locationPlaceholder?: string;
  /** Minimum number of nights required */
  minNights?: number;
  /** Maximum number of adults */
  maxAdults?: number;
  /** Maximum number of children */
  maxChildren?: number;
  /** Custom CSS class */
  className?: string;
}
