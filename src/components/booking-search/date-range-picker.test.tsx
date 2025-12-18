import { describe, test, expect } from "bun:test"
import type { AvailabilityDay } from "../../types/booking"

describe("DateRangePicker", () => {
  const mockAvailability: AvailabilityDay[] = [
    { date: "2025-01-15", price: 100, isAvailable: true },
    { date: "2025-01-16", price: 120, isAvailable: true },
    { date: "2025-01-17", price: 150, isAvailable: true },
    { date: "2025-01-18", price: 0, isAvailable: false },
  ]

  test("should handle date selection", () => {
    let selectedDates = { from: null as Date | null, to: null as Date | null }

    const onChange = (range: { from: Date | null; to: Date | null }) => {
      selectedDates = range
      console.log("✅ onChange called with:", range)
    }

    const testRange = {
      from: new Date("2025-01-15"),
      to: null as Date | null,
    }

    onChange(testRange)

    expect(selectedDates.from).toBeTruthy()
    console.log("📅 First date selected:", selectedDates.from)

    const testRange2 = {
      from: new Date("2025-01-15"),
      to: new Date("2025-01-17"),
    }

    onChange(testRange2)

    expect(selectedDates.from).toBeTruthy()
    expect(selectedDates.to).toBeTruthy()
    console.log("📅 Date range selected:", selectedDates)
  })

  test("should filter disabled days", () => {
    const disabledDates = mockAvailability
      .filter(day => !day.isAvailable)
      .map(day => day.date)

    console.log("🚫 Disabled dates:", disabledDates)
    expect(disabledDates).toContain("2025-01-18")
  })

  test("should calculate nights correctly", () => {
    const from = new Date("2025-01-15")
    const to = new Date("2025-01-17")

    const nights = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))

    console.log(`🌙 Nights between ${from.toISOString().split('T')[0]} and ${to.toISOString().split('T')[0]}: ${nights}`)
    expect(nights).toBe(2)
  })
})
