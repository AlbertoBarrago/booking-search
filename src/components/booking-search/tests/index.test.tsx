import { test, expect, describe, beforeEach } from "bun:test"
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BookingSearch } from "../index"
import type { SearchLocation, AvailabilityDay, BookingSearchPayload, BookingSearchTranslations } from "../../../types/booking"
import { format, addDays } from "date-fns"

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

describe("BookingSearch", () => {
  const today = new Date()
  const tomorrow = addDays(today, 1)
  const nextWeek = addDays(today, 7)

  const mockLocations: SearchLocation[] = [
    { id: "1", name: "Rome", type: "City" },
    { id: "2", name: "Milan", type: "City" },
    { id: "3", name: "Venice", type: "City" },
  ]

  const mockAvailability: AvailabilityDay[] = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(today, i)
    return {
      date: format(date, "yyyy-MM-dd"),
      isAvailable: true,
      price: 100 + i * 5,
    }
  })

  const mockOnSearch = (params: BookingSearchPayload) => {}

  beforeEach(() => {
    // Mock window.innerWidth for desktop view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  test("renders all search components on desktop", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
      />
    )

    expect(screen.getByText("Destination")).toBeDefined()
    expect(screen.getByText("Check-in - Check-out")).toBeDefined()
    expect(screen.getByText("Guests")).toBeDefined()
    expect(screen.getByRole("button", { name: /search/i })).toBeDefined()
  })

  test("displays default location when provided", () => {
    const firstLocation = mockLocations[0]
    if (!firstLocation) return

    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        defaultValues={{
          location: firstLocation,
          checkIn: null,
          checkOut: null,
          adults: 2,
          children: 0,
        }}
      />
    )

    expect(screen.getByText("Rome")).toBeDefined()
  })

  test("displays default dates when provided", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        defaultValues={{
          location: null,
          checkIn: today,
          checkOut: nextWeek,
          adults: 2,
          children: 0,
        }}
      />
    )

    const dateText = screen.getByText(/\d{2} \w{3} - \d{2} \w{3}/)
    expect(dateText).toBeDefined()
  })

  test("displays default guest count when provided", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        defaultValues={{
          location: null,
          checkIn: null,
          checkOut: null,
          adults: 3,
          children: 2,
        }}
        translations={italianTranslations}
      />
    )

    expect(screen.getByText("3 adulti, 2 bambini")).toBeDefined()
  })

  test("search button is disabled when location is not selected", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
      />
    )

    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton.hasAttribute("disabled")).toBe(true)
  })

  test("search button is disabled when dates are not selected", () => {
    const firstLocation = mockLocations[0]
    if (!firstLocation) return

    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        defaultValues={{
          location: firstLocation,
          checkIn: null,
          checkOut: null,
          adults: 2,
          children: 0,
        }}
      />
    )

    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton.hasAttribute("disabled")).toBe(true)
  })

  test("search button is enabled when location and dates are selected", () => {
    const firstLocation = mockLocations[0]
    if (!firstLocation) return

    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        defaultValues={{
          location: firstLocation,
          checkIn: today,
          checkOut: nextWeek,
          adults: 2,
          children: 0,
        }}
      />
    )

    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton.hasAttribute("disabled")).toBe(false)
  })

  test("calls onSearch with correct parameters when search button is clicked", () => {
    const firstLocation = mockLocations[0]
    if (!firstLocation) return

    let searchParams: BookingSearchPayload | null = null
    const handleSearch = (params: BookingSearchPayload) => {
      searchParams = params
    }

    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={handleSearch}
        defaultValues={{
          location: firstLocation,
          checkIn: today,
          checkOut: nextWeek,
          adults: 2,
          children: 1,
        }}
      />
    )

    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton).toBeDefined()
    fireEvent.click(searchButton)

    expect(searchParams).not.toBeNull()
    expect(searchParams!.location?.id).toBe(firstLocation.id)
    expect(searchParams!.adults).toBe(2)
    expect(searchParams!.children).toBe(1)
  })

  test("uses custom search button text when provided", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        searchButtonText="Ricerca"
      />
    )

    expect(screen.getByText("Ricerca")).toBeDefined()
  })

  test("uses custom location placeholder when provided", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        locationPlaceholder="Custom placeholder"
      />
    )

    expect(screen.getByText("Custom placeholder")).toBeDefined()
  })

  test("applies custom className to container", () => {
    const { container } = render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        className="custom-search-class"
      />
    )

    const searchContainer = container.querySelector('[role="search"]')
    expect(searchContainer?.classList.contains("custom-search-class")).toBe(true)
  })

  test("renders mobile view when window width is below 768px", () => {
    // Mock mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    })

    // Trigger resize event
    window.dispatchEvent(new Event("resize"))

    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        translations={italianTranslations}
      />
    )

    // In mobile view, a dialog trigger button should be rendered
    expect(screen.getByText("Dove vuoi andare?")).toBeDefined()
  })

  test("integrates all sub-components correctly", async () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
      />
    )

    // Test location selection
    const locationButton = screen.getByRole("combobox")
    expect(locationButton).toBeDefined()

    // Test date picker
    const dateButton = screen.getByRole("button", { name: "Select Date Range" })
    expect(dateButton).toBeDefined()

    // Test guest selector
    const guestButton = screen.getByRole("button", { name: "Select guests" })
    expect(guestButton).toBeDefined()

    // Test search button
    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton).toBeDefined()
  })

  test("passes minNights prop to DateRangePicker", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        minNights={3}
      />
    )

    // The component should render without errors
    expect(screen.getByText("Check-in - Check-out")).toBeDefined()
  })

  test("passes maxAdults prop to GuestSelector", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        maxAdults={10}
      />
    )

    // The component should render without errors
    expect(screen.getByText("Guests")).toBeDefined()
  })

  test("passes maxChildren prop to GuestSelector", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
        maxChildren={5}
      />
    )

    // The component should render without errors
    expect(screen.getByText("Guests")).toBeDefined()
  })

  test("updates state when location is changed", async () => {
    let searchParams: BookingSearchPayload | null = null
    const handleSearch = (params: BookingSearchPayload) => {
      searchParams = params
    }

    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={handleSearch}
        defaultValues={{
          location: null,
          checkIn: today,
          checkOut: nextWeek,
          adults: 2,
          children: 0,
        }}
      />
    )

    // Initially search button should be disabled
    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton.hasAttribute("disabled")).toBe(true)

    // Open location combobox
    const locationButton = screen.getByRole("combobox")
    fireEvent.click(locationButton)

    const locationItems = await waitFor(() => {
      const items = screen.getAllByText("Rome")
      expect(items.length).toBeGreaterThan(0)
      return items
    })

    // Click on the location in the popover
    const lastItem = locationItems[locationItems.length - 1]
    if (lastItem) {
      fireEvent.click(lastItem)
    }

    // Wait for state to update and get updated button reference
    const updatedSearchButton = await waitFor(() => {
      const btn = screen.getByRole("button", { name: /search/i })
      expect(btn).toBeDefined()
      expect(btn.hasAttribute("disabled")).toBe(false)
      return btn
    })

    // Click search button
    if (updatedSearchButton) {
      fireEvent.click(updatedSearchButton)
    }

    // Verify search params include the selected location
    const firstLocation = mockLocations[0]
    await waitFor(() => {
      expect(searchParams).not.toBeNull()
      if (searchParams && firstLocation) {
        expect(searchParams.location?.id).toBe(firstLocation.id)
      }
    })
  })

  test("has proper ARIA labels for accessibility", () => {
    render(
      <BookingSearch
        availability={mockAvailability}
        locations={mockLocations}
        onSearch={mockOnSearch}
      />
    )

    const searchContainer = screen.getByRole("search", { name: "Booking search" })
    expect(searchContainer).toBeDefined()

    const locationButton = screen.getByLabelText("Select location")
    expect(locationButton).toBeDefined()

    const dateButton = screen.getByLabelText("Select Date Range")
    expect(dateButton).toBeDefined()

    const guestButton = screen.getByLabelText("Select guests")
    expect(guestButton).toBeDefined()
  })
})
