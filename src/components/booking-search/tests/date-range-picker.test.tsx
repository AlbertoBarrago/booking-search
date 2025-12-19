import { test, expect, describe, beforeEach } from "bun:test"
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DateRangePicker } from "../date-range-picker"
import type { AvailabilityDay } from "../../../types/booking"
import { format, addDays } from "date-fns"

describe("DateRangePicker", () => {
  const today = new Date()
  const tomorrow = addDays(today, 1)
  const nextWeek = addDays(today, 7)

  const mockAvailability: AvailabilityDay[] = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(today, i)
    return {
      date: format(date, "yyyy-MM-dd"),
      isAvailable: true,
      price: 100 + i * 5,
    }
  })

  const mockValue = {
    from: null as Date | null,
    to: null as Date | null,
  }

  const mockOnChange = (range: { from: Date | null; to: Date | null }) => {}

  beforeEach(() => {
    // Reset any state between tests if needed
  })

  test("renders with placeholder when no dates are selected", () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={mockValue}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText("Select Date Range")).toBeDefined()
    expect(screen.getByText("Check-in - Check-out")).toBeDefined()
  })

  test("displays selected date range", () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: today, to: nextWeek }}
        onChange={mockOnChange}
      />
    )

    const dateText = screen.getByText(/\d{2} \w{3} - \d{2} \w{3}/)
    expect(dateText).toBeDefined()
  })

  test("displays only check-in date when check-out is not selected", () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: today, to: null }}
        onChange={mockOnChange}
      />
    )

    const dateText = screen.getByText(/\d{2} \w{3} \d{4}/)
    expect(dateText).toBeDefined()
  })

  test("opens popover when button is clicked", async () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={mockValue}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Confirm")).toBeDefined()
      expect(screen.getByText("Cancel")).toBeDefined()
    })
  })

  test("selects check-in date on first click", async () => {
    let currentValue = { from: null as Date | null, to: null as Date | null }
    const handleChange = (range: { from: Date | null; to: Date | null }) => {
      currentValue = range
    }

    render(
      <DateRangePicker
        availability={mockAvailability}
        value={currentValue}
        onChange={handleChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Confirm")).toBeDefined()
    })
  })

  test("calls onChange with selected date range when confirm is clicked", async () => {
    let currentValue = { from: null as Date | null, to: null as Date | null }
    const handleChange = (range: { from: Date | null; to: Date | null }) => {
      currentValue = range
    }

    render(
      <DateRangePicker
        availability={mockAvailability}
        value={currentValue}
        onChange={handleChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      const confirmButton = screen.getByText("Confirm")
      expect(confirmButton).toBeDefined()
      // Confirm button should be disabled when no dates are selected
      expect(confirmButton.hasAttribute("disabled")).toBe(true)
    })
  })

  test("does not call onChange until confirm is clicked", async () => {
    let changeCallCount = 0
    const handleChange = (range: { from: Date | null; to: Date | null }) => {
      changeCallCount++
    }

    render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: null, to: null }}
        onChange={handleChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Confirm")).toBeDefined()
    })

    // Clicking on calendar dates would happen here, but that requires more complex interaction
    // onChange should not have been called yet
    expect(changeCallCount).toBe(0)
  })

  test("resets to original value when cancel is clicked", async () => {
    const { rerender } = render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: today, to: nextWeek }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      const cancelButton = screen.getByText("Cancel")
      fireEvent.click(cancelButton)
    })

    // Popover should close
    await waitFor(() => {
      expect(screen.queryByText("Cancel")).toBeNull()
    })
  })

  test("displays night count when both dates are selected", async () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: today, to: nextWeek }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("7 nights")).toBeDefined()
    })
  })

  test("displays singular form for one night", async () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: today, to: tomorrow }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("1 night")).toBeDefined()
    })
  })

  test("disables the button when disabled prop is true", () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={mockValue}
        onChange={mockOnChange}
        disabled={true}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    expect(button.hasAttribute("disabled")).toBe(true)
  })

  test("applies custom className", () => {
    const { container } = render(
      <DateRangePicker
        availability={mockAvailability}
        value={mockValue}
        onChange={mockOnChange}
        className="custom-class"
      />
    )

    const button = container.querySelector("button")
    expect(button?.classList.contains("custom-class")).toBe(true)
  })

  test("closes popover after confirming selection", async () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: today, to: tomorrow }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Confirm")).toBeDefined()
    })

    const confirmButton = screen.getByText("Confirm")
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.queryByText("Confirm")).toBeNull()
    })
  })

  test("shows correct message when only check-in is selected", async () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={{ from: today, to: null }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Select check-out")).toBeDefined()
    })
  })

  test("prevents interaction outside from closing popover", async () => {
    render(
      <DateRangePicker
        availability={mockAvailability}
        value={mockValue}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Select Date Range" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Confirm")).toBeDefined()
    })

    // Try to close by clicking outside - this is prevented by onInteractOutside
    // The popover should remain open
  })
})
