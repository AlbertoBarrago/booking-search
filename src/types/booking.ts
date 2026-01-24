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
    /**
     * Search button text
     * @deprecated Use `translations.search` instead
     */
    searchButtonText?: string;
    /**
     * Placeholder for location field
     * @deprecated Use `translations.whereToGo` instead
     */
    locationPlaceholder?: string;
    /** Minimum number of nights required */
    minNights?: number;
    /** Maximum number of adults */
    maxAdults?: number;
    /** Maximum number of children */
    maxChildren?: number;
    /** Custom CSS class */
    className?: string;
    /**
     * Custom translations for all UI strings.
     * If not provided, English defaults will be used.
     * @see BookingSearchTranslations for available translation keys
     */
    translations?: BookingSearchTranslations;
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
  /**
   * Optional title for the combobox
   * @deprecated Use `translations.destination` instead
   */
  title?: string;
  /**
   * Placeholder text
   * @deprecated Use `translations.whereToGo` instead
   */
  placeholder?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Tab index */
  tabIndex?: number;
  /** Custom translations for location combobox strings */
  translations?: Pick<BookingSearchTranslations, 'destination' | 'whereToGo' | 'searchDestination' | 'noLocationFound'>;
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
  /** Custom translations for date range picker strings */
  translations?: Pick<BookingSearchTranslations, 'checkInCheckOut' | 'selectDateRange' | 'night' | 'nights' | 'selectCheckOut' | 'selectCheckOutMin' | 'confirm' | 'cancel'>;
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
  /** Custom translations for guest selector strings */
  translations?: Pick<BookingSearchTranslations, 'guests' | 'adults' | 'adultsDescription' | 'children' | 'childrenDescription' | 'adult' | 'adultsPlural' | 'child' | 'childrenPlural' | 'confirm'>;
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

/**
 * Translation strings for the BookingSearch component.
 * All strings are optional - if not provided, English defaults will be used.
 *
 * @example
 * ```tsx
 * // Italian translations
 * const italianTranslations: BookingSearchTranslations = {
 *   destination: "Destinazione",
 *   whereToGo: "Dove vuoi andare?",
 *   searchDestination: "Cerca una destinazione...",
 *   noLocationFound: "Nessuna località trovata.",
 *   checkInCheckOut: "Check-in - Check-out",
 *   selectDateRange: "Seleziona date",
 *   night: "notte",
 *   nights: "notti",
 *   selectCheckOut: "Seleziona check-out",
 *   selectCheckOutMin: "Seleziona check-out (min. {minNights} notti)",
 *   guests: "Ospiti",
 *   adults: "Adulti",
 *   adultsDescription: "Età 18+",
 *   children: "Bambini",
 *   childrenDescription: "Età 0-17",
 *   adult: "adulto",
 *   adultsPlural: "adulti",
 *   child: "bambino",
 *   childrenPlural: "bambini",
 *   guest: "ospite",
 *   guestsPlural: "ospiti",
 *   confirm: "Conferma",
 *   cancel: "Annulla",
 *   search: "Cerca",
 *   searchAccommodation: "Cerca il tuo alloggio",
 *   openSearch: "Apri ricerca",
 * };
 * ```
 */
export interface BookingSearchTranslations {
  // Location strings
  /** Label for the destination field. Default: "Destination" */
  destination?: string;
  /** Placeholder when no location is selected. Default: "Where do you want to go?" */
  whereToGo?: string;
  /** Placeholder for the location search input. Default: "Search a destination..." */
  searchDestination?: string;
  /** Message when no location matches the search. Default: "No location found." */
  noLocationFound?: string;

  // Date picker strings
  /** Label for the date range field. Default: "Check-in - Check-out" */
  checkInCheckOut?: string;
  /** Placeholder when no dates are selected. Default: "Select Date Range" */
  selectDateRange?: string;
  /** Singular form of "night". Default: "night" */
  night?: string;
  /** Plural form of "night". Default: "nights" */
  nights?: string;
  /** Message when check-out needs to be selected. Default: "Select check-out" */
  selectCheckOut?: string;
  /** Message for minimum nights requirement. Use {minNights} as placeholder. Default: "Select check-out (min. {minNights} nights)" */
  selectCheckOutMin?: string;

  // Guest selector strings
  /** Label for the guests field. Default: "Guests" */
  guests?: string;
  /** Label for adults stepper. Default: "Adults" */
  adults?: string;
  /** Description for adults stepper. Default: "Age 18+" */
  adultsDescription?: string;
  /** Label for children stepper. Default: "Children" */
  children?: string;
  /** Description for children stepper. Default: "Age 0-17" */
  childrenDescription?: string;
  /** Singular form of "adult" for display text. Default: "adult" */
  adult?: string;
  /** Plural form of "adult" for display text. Default: "adults" */
  adultsPlural?: string;
  /** Singular form of "child" for display text. Default: "child" */
  child?: string;
  /** Plural form of "child" for display text. Default: "children" */
  childrenPlural?: string;
  /** Singular form of "guest" for mobile summary. Default: "guest" */
  guest?: string;
  /** Plural form of "guest" for mobile summary. Default: "guests" */
  guestsPlural?: string;

  // Button strings
  /** Confirm button text. Default: "Confirm" */
  confirm?: string;
  /** Cancel button text. Default: "Cancel" */
  cancel?: string;
  /** Search button text. Default: "Search" */
  search?: string;

  // Dialog strings
  /** Title for the mobile dialog. Default: "Search your accommodation" */
  searchAccommodation?: string;
  /** Aria label for opening the search dialog. Default: "Open booking search" */
  openSearch?: string;
}