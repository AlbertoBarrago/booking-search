import React from "react"
import { createRoot } from "react-dom/client"
import { BookingSearch } from "./components/booking-search";
import type { BookingSearchPayload, SearchLocation, AvailabilityDay } from "./types/booking"
import "./styles/output.css"

const sampleLocations: SearchLocation[] = [
  {
    id: "1",
    name: "Roma, Italia",
    type: "City",
    countryCode: "IT",
  },
  {
    id: "2",
    name: "Firenze, Italia",
    type: "City",
    countryCode: "IT",
  },
  {
    id: "3",
    name: "Venezia, Italia",
    type: "City",
    countryCode: "IT",
  },
  {
    id: "4",
    name: "Milano, Italia",
    type: "City",
    countryCode: "IT",
  },
  {
    id: "5",
    name: "Napoli, Italia",
    type: "City",
    countryCode: "IT",
  },
  {
    id: "6",
    name: "Torino, Italia",
    type: "City",
    countryCode: "IT",
  },
  {
    id: "7",
    name: "Cagliari, Italia",
    type: "City",
    countryCode: "IT",
  },
]

function generateAvailability(): AvailabilityDay[] {
  const availability: AvailabilityDay[] = []
  const today = new Date()

  // Generate 90 days of availability
  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Simulate random availability
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const basePrice = isWeekend ? 150 : 100
    const priceVariation = Math.floor(Math.random() * 50)
    const isAvailable = Math.random() > 0.1 // 90% availability

    availability.push({
      date: date.toISOString().split('T')[0] || "",
      price: basePrice + priceVariation,
      isAvailable,
    })
  }

  return availability
}

function Demo() {
  const [availability] = React.useState(generateAvailability())

  const handleSearch = (payload: BookingSearchPayload) => {
    console.log("🔍 Search performed:", payload)

    if (payload.checkIn && payload.checkOut) {
      const checkInStr = payload.checkIn.toISOString().split('T')[0]
      const checkOutStr = payload.checkOut.toISOString().split('T')[0]

      const relevantDays = availability.filter(day => {
        if(checkInStr && checkOutStr)
          return day.date >= checkInStr && day.date < checkOutStr
      })

      const totalPrice = relevantDays.reduce((sum, day) => sum + day.price, 0)

      console.log(`💰 Estimated total price: €${totalPrice}`)
      console.log(`📅 Number of nights: ${relevantDays.length}`)

      alert(
        `Search completed!\n\n` +
        `📍 Destination: ${payload.location?.name || 'Not selected'}\n` +
        `📅 Check-in: ${payload.checkIn.toLocaleDateString('en-US')}\n` +
        `📅 Check-out: ${payload.checkOut.toLocaleDateString('en-US')}\n` +
        `👥 Guests: ${payload.adults} adults, ${payload.children} children\n` +
        `🌙 Nights: ${relevantDays.length}\n` +
        `💰 Estimated price: €${totalPrice}`
      )
    } else {
      alert("Please select check-in and check-out dates")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <a
        href="https://github.com/AlbertoBarrago/booking-search"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-0 top-0 z-50 group"
        aria-label="View source on GitHub"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          className="fill-slate-900 text-white transition-colors duration-300 group-hover:fill-slate-700"
          aria-hidden="true"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            className="origin-[130px_106px] group-hover:animate-[wave_560ms_ease-in-out]"
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
          />
        </svg>
      </a>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            BookingSearch
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Agnostic React component for booking search
          </p>
        </div>

        <BookingSearch
          locations={sampleLocations}
          availability={availability}
          onSearch={handleSearch}
          minNights={2}
          maxAdults={10}
          maxChildren={5}
        />

        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            📋 Features
          </h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Location Combobox:</strong> Smart search with Command pattern (Shadcn)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Date Range Picker:</strong> Calendar with inline prices and availability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Guest Selector:</strong> Stepper for adults and children</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Responsive Design:</strong> Horizontal bar on desktop, Dialog on mobile</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Accessibility:</strong> ARIA attributes, full keyboard navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Type-Safe:</strong> TypeScript with complete interfaces</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Agnostic:</strong> Input data via props, results via callback</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>i18n Ready:</strong> Full translation support via translations prop</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 rounded-lg bg-slate-900 p-6 text-white">
          <h2 className="mb-4 text-xl font-semibold">💻 Usage</h2>
          <pre className="overflow-x-auto text-sm">
            <code>{`import { BookingSearch } from '@balby/booking-search'
import type { BookingSearchPayload, SearchLocation, AvailabilityDay } from '@balby/booking-search'

...

function App() {
  const handleSearch = (payload: BookingSearchPayload) => {
    // Handle the search
    console.log(payload)
  }

  return (
    <BookingSearch
      locations={sampleLocations}
      availability={availability}
      onSearch={handleSearch}
      minNights={2}
      maxAdults={10}
      maxChildren={5}
    />
  )
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById("root")!)
root.render(<Demo />)
