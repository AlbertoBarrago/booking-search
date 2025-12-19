import React from "react"
import { createRoot } from "react-dom/client"
import { BookingSearch } from "./components/booking-search"
import type { BookingSearchPayload, SearchLocation, AvailabilityDay } from "./types/booking"
import "./styles/output.css"

// Sample location data
const sampleLocations: SearchLocation[] = [
  {
    id: "1",
    name: "Roma, Italia",
    type: "Città",
    countryCode: "IT",
  },
  {
    id: "2",
    name: "Firenze, Italia",
    type: "Città",
    countryCode: "IT",
  },
  {
    id: "3",
    name: "Venezia, Italia",
    type: "Città",
    countryCode: "IT",
  },
  {
    id: "4",
    name: "Milano, Italia",
    type: "Città",
    countryCode: "IT",
  },
  {
    id: "5",
    name: "Napoli, Italia",
    type: "Città",
    countryCode: "IT",
  },
  {
    id: "6",
    name: "Torino, Italia",
    type: "Città",
    countryCode: "IT",
  },
  {
    id: "7",
    name: "Cagliari, Italia",
    type: "Città",
    countryCode: "IT",
  },
]

// Function to generate sample availability data
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

    // Calculate total price if dates are selected
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

      // Show alert with details
      alert(
        `Search completed!\n\n` +
        `📍 Destination: ${payload.location?.name || 'Not selected'}\n` +
        `📅 Check-in: ${payload.checkIn.toLocaleDateString('it-IT')}\n` +
        `📅 Check-out: ${payload.checkOut.toLocaleDateString('it-IT')}\n` +
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            BookingSearch Widget
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Agnostic React component for booking search
          </p>
        </div>

        <BookingSearch
          locations={sampleLocations}
          availability={availability}
          onSearch={handleSearch}
          minNights={1}
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
          </ul>
        </div>

        <div className="mt-6 rounded-lg bg-slate-900 p-6 text-white">
          <h2 className="mb-4 text-xl font-semibold">💻 Usage</h2>
          <pre className="overflow-x-auto text-sm">
            <code>{`import { BookingSearch } from './components/booking-search'
import type { BookingSearchPayload } from './types/booking'

function App() {
  const handleSearch = (payload: BookingSearchPayload) => {
    // Handle the search
    console.log(payload)
  }

  return (
    <BookingSearch
      locations={locations}
      availability={availability}
      onSearch={handleSearch}
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
