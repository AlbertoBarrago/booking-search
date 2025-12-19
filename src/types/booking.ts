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
 * Selectable location for booking search
 */
export interface SearchLocation {
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
    location: SearchLocation | null;
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
    locations: SearchLocation[];
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

/**
 * Props for the LocationCombobox component
 */
export interface LocationComboboxProps {
  /** List of locations to display */
  locations: SearchLocation[];
  /** Currently selected location */
  value: SearchLocation | null;
  /** Callback when location changes */
  onChange: (location: SearchLocation | null) => void;
  /** Optional title for the combobox */
  title?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Tab index */
  tabIndex?: number;
}

/**
 * Props for the DateRangePicker component
 */
export interface DateRangePickerProps {
  /** Availability and prices for dates */
  availability: AvailabilityDay[];
  /** Selected date range */
  value: { from: Date | null; to: Date | null };
  /** Callback when date range changes */
  onChange: (range: { from: Date | null; to: Date | null }) => void;
  /** Minimum number of nights required */
  minNights?: number;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Tab index */
  tabIndex?: number;
}

/**
 * Props for the GuestSelector component
 */
export interface GuestSelectorProps {
  /** Current guest data */
  value: GuestData;
  /** Callback when guest data changes */
  onChange: (guests: GuestData) => void;
  /** Maximum number of adults */
  maxAdults?: number;
  /** Maximum number of children */
  maxChildren?: number;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Tab index */
  tabIndex?: number;
}

/**
 * Props for the GuestStepper component (internal)
 */
export interface GuestStepperProps {
  /** Label for the stepper */
  label: string;
  /** Optional description */
  description?: string;
  /** Current value */
  value: number;
  /** Callback to increment */
  onIncrement: () => void;
  /** Callback to decrement */
  onDecrement: () => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
}
