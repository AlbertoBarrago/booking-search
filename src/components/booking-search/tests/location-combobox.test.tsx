import { test, expect, describe, beforeEach } from "bun:test"
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LocationCombobox } from "../location-combobox"
import type { Location } from "../../../types/booking"

describe("LocationCombobox", () => {
  const mockLocations: Location[] = [
    { id: "1", name: "Rome", type: "City" },
    { id: "2", name: "Milan", type: "City" },
    { id: "3", name: "Venice", type: "City" },
  ]

  const mockOnChange = (location: Location | null) => {}

  beforeEach(() => {
    // Reset any state between tests if needed
  })

  test("renders with placeholder when no value is selected", () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
        placeholder="Where do you want to go?"
      />
    )

    expect(screen.getByText("Where do you want to go?")).toBeDefined()
    expect(screen.getByText("Destinazione")).toBeDefined()
  })

  test("displays selected location", () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={mockLocations[0] as Location | null}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText("Rome")).toBeDefined()
  })

  test("opens popover when button is clicked", async () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("combobox")
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search a destination...")).toBeDefined()
    })
  })

  test("displays all locations in the popover", async () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("combobox")
    fireEvent.click(button)

    await waitFor(() => {
      for (const location of mockLocations) {
        expect(screen.getAllByText(location.name).length).toBeGreaterThan(0)
      }
    })
  })

  test("calls onChange when a location is selected", async () => {
    let selectedLocation: Location | null = null
    const handleChange = (location: Location | null) => {
      selectedLocation = location
    }

    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={handleChange}
      />
    )

    const button = screen.getByRole("combobox")
    fireEvent.click(button)

    const locationItems = await waitFor(() => {
      const items = screen.getAllByText("Rome")
      expect(items.length).toBeGreaterThan(0)
      return items
    })

    // Click on the location in the popover (not the button)
    const lastItem = locationItems[locationItems.length - 1]
    if (lastItem) {
      fireEvent.click(lastItem)
    }

    await waitFor(() => {
      expect(selectedLocation).not.toBeNull()
      if (selectedLocation) {
        expect(selectedLocation.id).toBe(mockLocations[0]?.id as string)
      }
    })
  })

  test("toggles selection when clicking on already selected location", async () => {
    const firstLocation = mockLocations[0]
    if (!firstLocation) return

    let selectedLocation: Location | null = firstLocation
    const handleChange = (location: Location | null) => {
      selectedLocation = location
    }

    render(
      <LocationCombobox
        locations={mockLocations}
        value={firstLocation}
        onChange={handleChange}
      />
    )

    const button = screen.getByRole("combobox")
    fireEvent.click(button)

    const locationItems = await waitFor(() => {
      const items = screen.getAllByText("Rome")
      expect(items.length).toBeGreaterThan(0)
      return items
    })

    const lastItem = locationItems[locationItems.length - 1]
    if (lastItem) {
      fireEvent.click(lastItem)
    }

    await waitFor(() => {
      expect(selectedLocation).toBe(null)
    })
  })

  test("disables the button when disabled prop is true", () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
        disabled={true}
      />
    )

    const button = screen.getByRole("combobox")
    expect(button.hasAttribute("disabled")).toBe(true)
  })

  test("shows location type when available", async () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("combobox")
    fireEvent.click(button)

    await waitFor(() => {
      mockLocations.forEach((location) => {
        if (location.type) {
          expect(screen.getAllByText(location.type).length).toBeGreaterThan(0)
        }
      })
    })
  })

  test("shows empty message when no locations match search", async () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("combobox")
    fireEvent.click(button)

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search a destination...")
      fireEvent.change(searchInput, { target: { value: "Nonexistent City" } })
    })

    await waitFor(() => {
      expect(screen.getByText("No location found.")).toBeDefined()
    })
  })

  test("applies custom className", () => {
    const { container } = render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
        className="custom-class"
      />
    )

    const button = container.querySelector("button")
    expect(button).toBeDefined()
    expect(button?.classList.contains("custom-class")).toBe(true)
  })

  test("closes popover after selecting a location", async () => {
    render(
      <LocationCombobox
        locations={mockLocations}
        value={null}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("combobox")
    expect(button).toBeDefined()
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search a destination...")).toBeDefined()
    })

    const locationItems = await waitFor(() => {
      const items = screen.getAllByText("Milan")
      expect(items.length).toBeGreaterThan(0)
      return items
    })

    const lastItem = locationItems[locationItems.length - 1]
    if (lastItem) {
      fireEvent.click(lastItem)
    }

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Search a destination...")).toBeNull()
    })
  })
})
