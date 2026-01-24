# BookingSearch (React)

[![npm version](https://img.shields.io/npm/v/@balby/booking-search.svg)](https://www.npmjs.com/package/@balby/booking-search)
[![Coverage](https://img.shields.io/badge/coverage-94.73%25-brightgreen.svg)](./coverage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-63%20passing-success.svg)](./src/components/booking-search/tests/)

A framework-agnostic, high-performance, and accessible React component for booking searches, inspired by the Booking.com search bar.

## 🚀 Features

* ✅ **Fully Agnostic**: Data flows in via props, results flow out via callbacks
* ✅ **TypeScript First**: Complete, type-safe interfaces
* ✅ **Accessibility**: Full keyboard navigation and ARIA attributes (Radix UI)
* ✅ **Responsive**: Horizontal layout on desktop, Dialog on mobile
* ✅ **Internationalization (i18n)**: Full translation support with customizable strings
* ✅ **Modular Components**:
  * `LocationCombobox`: Location search using the Command pattern (Shadcn)
  * `DateRangePicker`: Calendar with inline prices and availability
  * `GuestSelector`: Stepper for adults and children
* ✅ **Styled with Tailwind CSS**: Modern and easily customizable
* ✅ **Built with Bun**: Optimized performance

## 📦 Installation

```bash
npm install @balby/booking-search
# or
yarn add @balby/booking-search
# or
bun add @balby/booking-search
```

### Peer Dependencies
This component requires React 19 and Tailwind CSS. Make sure they are installed:


```bash
npm install react react-dom tailwindcss
```

### Importing Styles

This package requires you to import the CSS file. Choose one of the following methods:

**Option 1: Import in your JavaScript/TypeScript (Recommended)**
```tsx
import '@balby/booking-search/styles'
```

**Option 2: Import in your global CSS file**
```css
@import '@balby/booking-search/styles';
```

**Option 3: Direct path import**
```tsx
import '@balby/booking-search/dist/index.css'
```

> **Note:** All import methods are supported. Choose the one that best fits your build setup.

## 🎯 Quick Start

### Basic Usage

**Important:** You must import the CSS file for the component to display correctly.

```tsx
import '@balby/booking-search/styles'
import { BookingSearch } from '@balby/booking-search'
import type { BookingSearchPayload, SearchLocation, AvailabilityDay } from '@balby/booking-search'

const locations: SearchLocation[] = [
  { id: '1', name: 'Rome, Italy', type: 'City', countryCode: 'IT' },
  { id: '2', name: 'Florence, Italy', type: 'City', countryCode: 'IT' },
]

const availability: AvailabilityDay[] = [
  { date: '2026-01-15', price: 120, isAvailable: true },
  { date: '2026-01-16', price: 150, isAvailable: true },
  { date: '2026-01-17', price: 0, isAvailable: false },
]

function App() {
  const handleSearch = (payload: BookingSearchPayload) => {
    console.log('Search:', payload)
    // Send data to your backend or API
  }

  return (
    <BookingSearch
      locations={locations}
      availability={availability}
      onSearch={handleSearch}
      searchButtonText="Search availability"
      minNights={1}
      maxAdults={10}
      maxChildren={5}
    />
  )
}
```

## 📋 API

### BookingSearchProps

| Prop                  | Type                                      | Default                  | Description                                      |
| --------------------- | ----------------------------------------- | ------------------------ | ------------------------------------------------ |
| `locations`           | `Location[]`                              | **Required**             | List of available locations for search           |
| `availability`        | `AvailabilityDay[]`                       | **Required**             | Availability and prices by date                  |
| `onSearch`            | `(payload: BookingSearchPayload) => void` | **Required**             | Callback triggered when the user starts a search |
| `defaultValues`       | `Partial<BookingSearchPayload>`           | `undefined`              | Initial values (optional)                        |
| `translations`        | `BookingSearchTranslations`               | English defaults         | Custom translations for all UI strings           |
| `minNights`           | `number`                                  | `1`                      | Minimum number of nights required                |
| `maxAdults`           | `number`                                  | `30`                     | Maximum number of adults                         |
| `maxChildren`         | `number`                                  | `10`                     | Maximum number of children                       |
| `className`           | `string`                                  | `undefined`              | Custom CSS class                                 |

> **Note:** `searchButtonText` and `locationPlaceholder` props are deprecated. Use `translations.search` and `translations.whereToGo` instead.

### TypeScript Interfaces

#### AvailabilityDay

```ts
interface AvailabilityDay {
  date: string           // ISO format (YYYY-MM-DD)
  price: number          // Price for this date
  isAvailable: boolean   // Availability
}
```

#### Location

```ts
interface Location {
  id: string
  name: string
  type?: string          // Location type (city, hotel, etc.)
  countryCode?: string   // ISO country code
}
```

#### BookingSearchPayload

```ts
interface BookingSearchPayload {
  location: Location | null
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  children: number
}
```

## 🌍 Internationalization (i18n)

The component supports full internationalization through the `translations` prop. All UI strings can be customized.

### Basic Translation Example

```tsx
import { BookingSearch } from '@balby/booking-search'
import type { BookingSearchTranslations } from '@balby/booking-search'

const italianTranslations: BookingSearchTranslations = {
  destination: "Destinazione",
  whereToGo: "Dove vuoi andare?",
  searchDestination: "Cerca una destinazione...",
  noLocationFound: "Nessuna località trovata.",
  checkInCheckOut: "Check-in - Check-out",
  selectDateRange: "Seleziona date",
  night: "notte",
  nights: "notti",
  selectCheckOut: "Seleziona check-out",
  selectCheckOutMin: "Seleziona check-out (min. {minNights} notti)",
  guests: "Ospiti",
  adults: "Adulti",
  adultsDescription: "Età 18+",
  children: "Bambini",
  childrenDescription: "Età 0-17",
  adult: "adulto",
  adultsPlural: "adulti",
  child: "bambino",
  childrenPlural: "bambini",
  guest: "ospite",
  guestsPlural: "ospiti",
  confirm: "Conferma",
  cancel: "Annulla",
  search: "Cerca",
  searchAccommodation: "Cerca il tuo alloggio",
  openSearch: "Apri ricerca",
}

<BookingSearch
  locations={locations}
  availability={availability}
  onSearch={handleSearch}
  translations={italianTranslations}
/>
```

### Available Translation Keys

All translation keys are optional. If not provided, English defaults are used.

| Key | Default | Description |
| --- | ------- | ----------- |
| `destination` | "Destination" | Label for the destination field |
| `whereToGo` | "Where do you want to go?" | Placeholder when no location is selected |
| `searchDestination` | "Search a destination..." | Placeholder for location search input |
| `noLocationFound` | "No location found." | Message when no location matches |
| `checkInCheckOut` | "Check-in - Check-out" | Label for date range field |
| `selectDateRange` | "Select Date Range" | Placeholder when no dates selected |
| `night` | "night" | Singular form |
| `nights` | "nights" | Plural form |
| `selectCheckOut` | "Select check-out" | Message when check-out needed |
| `selectCheckOutMin` | "Select check-out (min. {minNights} nights)" | Min nights message (use `{minNights}` placeholder) |
| `guests` | "Guests" | Label for guests field |
| `adults` | "Adults" | Label for adults stepper |
| `adultsDescription` | "Age 18+" | Description for adults |
| `children` | "Children" | Label for children stepper |
| `childrenDescription` | "Age 0-17" | Description for children |
| `adult` | "adult" | Singular form for display |
| `adultsPlural` | "adults" | Plural form for display |
| `child` | "child" | Singular form for display |
| `childrenPlural` | "children" | Plural form for display |
| `guest` | "guest" | Singular for mobile summary |
| `guestsPlural` | "guests" | Plural for mobile summary |
| `confirm` | "Confirm" | Confirm button text |
| `cancel` | "Cancel" | Cancel button text |
| `search` | "Search" | Search button text |
| `searchAccommodation` | "Search your accommodation" | Mobile dialog title |
| `openSearch` | "Open booking search" | Aria label for mobile trigger |

### Partial Translations

You can provide only the strings you want to override:

```tsx
<BookingSearch
  translations={{
    search: "Find Hotels",
    confirm: "Apply",
  }}
  // ... other props
/>
```

## 🎨 Customization

The component uses Tailwind CSS for styling. You can customize colors and themes via `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
}
```

## 🔧 Standalone Sub-components

You can also use individual subcomponents:

```tsx
import { LocationCombobox, DateRangePicker, GuestSelector } from '@balby/booking-search';
import '@balby/booking-search/styles';

// LocationCombobox
<LocationCombobox
  locations={locations}
  value={selectedLocation}
  onChange={setSelectedLocation}
/>

// DateRangePicker
<DateRangePicker
  availability={availability}
  value={{ from: checkIn, to: checkOut }}
  onChange={setDateRange}
  minNights={1}
/>

// GuestSelector
<GuestSelector
  value={{ adults: 2, children: 0 }}
  onChange={setGuests}
  maxAdults={10}
  maxChildren={5}
/>
```

## ♿ Accessibility

The component follows accessibility best practices:

* **Full keyboard navigation**: Tab, Enter, Escape, arrow keys
* **ARIA attributes**: All components include appropriate ARIA attributes
* **Screen reader friendly**: Labels and descriptions for all interactive elements
* **Focus management**: Focus trapping in popovers and dialogs
* **Responsive design**: Optimized for all devices

## 🏗️ Project Structure

```
BookingWidget/
├── src/
│   ├── components/
│   │   └── booking-search/
│   │       ├── index.tsx              # Main component
│   │       ├── location-combobox.tsx  # Location combobox
│   │       ├── date-range-picker.tsx  # Date picker
│   │       ├── guest-selector.tsx     # Guest selector
│   │       └── ui/                    # Base UI components (Shadcn)
│   ├── types/
│   │   └── booking.ts                 # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts                   # Utility functions
│   ├── styles/
│   │   └── globals.css                # Global styles
│   ├── demo.tsx                       # Interactive demo
│   └── index.ts                       # Library entry point
├── index.html                         # Demo HTML
├── index.ts                           # Bun server
├── tailwind.config.js                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json
```

## 🧪 Testing

The project includes 63 tests with 94.73% coverage.

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Production Build

```bash
bun run build
```

The optimized bundle will be available in the `dist/` folder.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

MIT

## 🙏 Credits

* Inspired by [Booking.com](https://www.booking.com)
* UI components: [Shadcn/UI](https://ui.shadcn.com)
* Primitives: [Radix UI](https://www.radix-ui.com)
* Icons: [Lucide React](https://lucide.dev)
* Date picker: [react-day-picker](https://react-day-picker.js.org)
* Built with [Bun](https://bun.sh)
* Thanks to Claude Code for being a great teammate!
