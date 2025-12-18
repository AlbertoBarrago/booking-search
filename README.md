# BookingSearch Widget

[![npm version](https://img.shields.io/npm/v/@booking-widget/react.svg)](https://www.npmjs.com/package/@booking-widget/react)
[![Coverage](https://img.shields.io/badge/coverage-94.73%25-brightgreen.svg)](./coverage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-63%20passing-success.svg)](./src/components/booking-search/tests/)

Componente React agnostico, altamente performante e accessibile per la ricerca di prenotazioni, ispirato alla search bar di Booking.com.

## 🚀 Caratteristiche

- ✅ **Totalmente Agnostico**: I dati entrano tramite props, i risultati escono tramite callback
- ✅ **TypeScript First**: Interfacce complete e type-safe
- ✅ **Accessibilità**: Piena navigazione da tastiera e attributi ARIA (Radix UI)
- ✅ **Responsive**: Layout orizzontale su desktop, Dialog su mobile
- ✅ **Componenti Modulari**:
  - `LocationCombobox`: Ricerca località con Command pattern (Shadcn)
  - `DateRangePicker`: Calendario con prezzi inline e disponibilità
  - `GuestSelector`: Stepper per adulti e bambini
- ✅ **Styled con Tailwind CSS**: Personalizzabile e moderno
- ✅ **Built con Bun**: Performance ottimizzate

## 📦 Installazione

```bash
npm install @booking-widget/react
# or
yarn add @booking-widget/react
# or
bun add @booking-widget/react
```

### Peer Dependencies

Il componente richiede React 19 e Tailwind CSS. Assicurati di averli installati:

```bash
npm install react react-dom tailwindcss
```

## 🎯 Quick Start

### Utilizzo base

```tsx
import { BookingSearch } from '@booking-widget/react'
import type { BookingSearchPayload, Location, AvailabilityDay } from '@booking-widget/react'

const locations: Location[] = [
  { id: '1', name: 'Roma, Italia', type: 'Città', countryCode: 'IT' },
  { id: '2', name: 'Firenze, Italia', type: 'Città', countryCode: 'IT' },
]

const availability: AvailabilityDay[] = [
  { date: '2025-01-15', price: 120, isAvailable: true },
  { date: '2025-01-16', price: 150, isAvailable: true },
  { date: '2025-01-17', price: 0, isAvailable: false },
]

function App() {
  const handleSearch = (payload: BookingSearchPayload) => {
    console.log('Ricerca:', payload)
    // Invia i dati al tuo backend o API
  }

  return (
    <BookingSearch
      locations={locations}
      availability={availability}
      onSearch={handleSearch}
      searchButtonText="Cerca disponibilità"
      minNights={1}
      maxAdults={10}
      maxChildren={5}
    />
  )
}
```

## 📋 API

### BookingSearchProps

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `locations` | `Location[]` | **Required** | Lista delle località disponibili per la ricerca |
| `availability` | `AvailabilityDay[]` | **Required** | Disponibilità e prezzi per le date |
| `onSearch` | `(payload: BookingSearchPayload) => void` | **Required** | Callback chiamata quando l'utente avvia una ricerca |
| `defaultValues` | `Partial<BookingSearchPayload>` | `undefined` | Valori iniziali (opzionale) |
| `searchButtonText` | `string` | `"Cerca"` | Testo del pulsante di ricerca |
| `locationPlaceholder` | `string` | `"Dove vuoi andare?"` | Placeholder per il campo località |
| `minNights` | `number` | `1` | Numero minimo di notti richiesto |
| `maxAdults` | `number` | `30` | Numero massimo di adulti |
| `maxChildren` | `number` | `10` | Numero massimo di bambini |
| `className` | `string` | `undefined` | Classe CSS personalizzata |

### Interfacce TypeScript

#### AvailabilityDay

```typescript
interface AvailabilityDay {
  date: string           // Formato ISO (YYYY-MM-DD)
  price: number          // Prezzo per questa data
  isAvailable: boolean   // Disponibilità
}
```

#### Location

```typescript
interface Location {
  id: string
  name: string
  type?: string          // Tipo di località (città, hotel, etc.)
  countryCode?: string   // Codice paese ISO
}
```

#### BookingSearchPayload

```typescript
interface BookingSearchPayload {
  location: Location | null
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  children: number
}
```

## 🎨 Personalizzazione

Il componente utilizza Tailwind CSS per lo styling. Puoi personalizzare i colori e il tema modificando `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        // I tuoi colori personalizzati
      },
    },
  },
}
```

## 🔧 Sotto-componenti Standalone

Puoi utilizzare i sotto-componenti individualmente:

```tsx
import { LocationCombobox, DateRangePicker, GuestSelector } from '@booking-widget/react';

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

## ♿ Accessibilità

Il componente segue le best practice di accessibilità:

- **Navigazione da tastiera completa**: Tab, Enter, Escape, frecce direzionali
- **Attributi ARIA**: Tutti i componenti includono gli attributi ARIA appropriati
- **Screen reader friendly**: Label e descrizioni per tutti gli elementi interattivi
- **Focus management**: Focus trap nei popover e dialog
- **Responsive design**: Ottimizzato per tutti i device

## 🏗️ Struttura del Progetto

```
BookingWidget/
├── src/
│   ├── components/
│   │   └── booking-search/
│   │       ├── index.tsx              # Componente principale
│   │       ├── location-combobox.tsx  # Combobox località
│   │       ├── date-range-picker.tsx  # Date picker
│   │       ├── guest-selector.tsx     # Selettore ospiti
│   │       └── ui/                    # Componenti UI base (Shadcn)
│   ├── types/
│   │   └── booking.ts                 # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts                   # Utility functions
│   ├── styles/
│   │   └── globals.css                # Stili globali
│   ├── demo.tsx                       # Demo interattiva
│   └── index.ts                       # Entry point della libreria
├── index.html                         # HTML per la demo
├── index.ts                           # Server Bun
├── tailwind.config.js                 # Configurazione Tailwind
├── tsconfig.json                      # Configurazione TypeScript
└── package.json
```

## 🧪 Testing

Il progetto include 63 test con una copertura del 94.73%.

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Build per produzione

```bash
bun run build
```

Il bundle ottimizzato sarà disponibile nella cartella `dist/`.

## 🤝 Contribuire

Contributi, issue e feature request sono benvenuti!

## 📝 Licenza

MIT

## 🙏 Credits

- Ispirato a [Booking.com](https://www.booking.com)
- UI components: [Shadcn/UI](https://ui.shadcn.com)
- Primitives: [Radix UI](https://www.radix-ui.com)
- Icons: [Lucide React](https://lucide.dev)
- Date picker: [react-day-picker](https://react-day-picker.js.org)
- Built with [Bun](https://bun.sh)
