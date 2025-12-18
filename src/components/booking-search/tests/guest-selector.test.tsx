import { test, expect, describe, beforeEach } from "bun:test"
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { GuestSelector } from "../guest-selector"
import type { GuestData } from "../../../types/booking"

describe("GuestSelector", () => {
  const mockValue: GuestData = {
    adults: 2,
    children: 0,
  }

  const mockOnChange = (guests: GuestData) => {}

  beforeEach(() => {
    // Reset any state between tests if needed
  })

  test("renders with default guest count", () => {
    render(<GuestSelector value={mockValue} onChange={mockOnChange} />)

    expect(screen.getByText("Ospiti")).toBeDefined()
    expect(screen.getByText("2 adulti")).toBeDefined()
  })

  test("displays singular form for one adult", () => {
    render(
      <GuestSelector
        value={{ adults: 1, children: 0 }}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText("1 adulto")).toBeDefined()
  })

  test("displays children count when children > 0", () => {
    render(
      <GuestSelector
        value={{ adults: 2, children: 1 }}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText("2 adulti, 1 bambino")).toBeDefined()
  })

  test("displays plural form for multiple children", () => {
    render(
      <GuestSelector
        value={{ adults: 2, children: 3 }}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText("2 adulti, 3 bambini")).toBeDefined()
  })

  test("opens popover when button is clicked", async () => {
    render(<GuestSelector value={mockValue} onChange={mockOnChange} />)

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Adulti")).toBeDefined()
      expect(screen.getByText("Bambini")).toBeDefined()
    })
  })

  test("displays guest steppers in popover", async () => {
    render(<GuestSelector value={mockValue} onChange={mockOnChange} />)

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Adulti")).toBeDefined()
      expect(screen.getByText("Età 18+")).toBeDefined()
      expect(screen.getByText("Bambini")).toBeDefined()
      expect(screen.getByText("Età 0-17")).toBeDefined()
    })
  })

  test("increments adults when plus button is clicked", async () => {
    let currentValue = { adults: 2, children: 0 }
    const handleChange = (guests: GuestData) => {
      currentValue = guests
    }

    render(<GuestSelector value={currentValue} onChange={handleChange} />)

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const incrementButton = screen.getByLabelText("Increase adulti")
      fireEvent.click(incrementButton)
    })

    const confirmButton = screen.getByText("Conferma")
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(currentValue.adults).toBe(3)
    })
  })

  test("decrements adults when minus button is clicked", async () => {
    let currentValue = { adults: 2, children: 0 }
    const handleChange = (guests: GuestData) => {
      currentValue = guests
    }

    render(<GuestSelector value={currentValue} onChange={handleChange} />)

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const decrementButton = screen.getByLabelText("Decrease adulti")
      fireEvent.click(decrementButton)
    })

    const confirmButton = screen.getByText("Conferma")
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(currentValue.adults).toBe(1)
    })
  })

  test("increments children when plus button is clicked", async () => {
    let currentValue = { adults: 2, children: 0 }
    const handleChange = (guests: GuestData) => {
      currentValue = guests
    }

    render(<GuestSelector value={currentValue} onChange={handleChange} />)

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const incrementButton = screen.getByLabelText("Increase bambini")
      fireEvent.click(incrementButton)
    })

    const confirmButton = screen.getByText("Conferma")
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(currentValue.children).toBe(1)
    })
  })

  test("decrements children when minus button is clicked", async () => {
    let currentValue = { adults: 2, children: 2 }
    const handleChange = (guests: GuestData) => {
      currentValue = guests
    }

    render(<GuestSelector value={currentValue} onChange={handleChange} />)

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const decrementButton = screen.getByLabelText("Decrease bambini")
      fireEvent.click(decrementButton)
    })

    const confirmButton = screen.getByText("Conferma")
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(currentValue.children).toBe(1)
    })
  })

  test("prevents decrementing adults below 1", async () => {
    render(
      <GuestSelector
        value={{ adults: 1, children: 0 }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const decrementButton = screen.getByLabelText("Decrease adulti")
      expect(decrementButton.hasAttribute("disabled")).toBe(true)
    })
  })

  test("prevents decrementing children below 0", async () => {
    render(
      <GuestSelector
        value={{ adults: 2, children: 0 }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const decrementButton = screen.getByLabelText("Decrease bambini")
      expect(decrementButton.hasAttribute("disabled")).toBe(true)
    })
  })

  test("prevents incrementing adults above maxAdults", async () => {
    render(
      <GuestSelector
        value={{ adults: 5, children: 0 }}
        onChange={mockOnChange}
        maxAdults={5}
      />
    )

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const incrementButton = screen.getByLabelText("Increase adulti")
      expect(incrementButton.hasAttribute("disabled")).toBe(true)
    })
  })

  test("prevents incrementing children above maxChildren", async () => {
    render(
      <GuestSelector
        value={{ adults: 2, children: 3 }}
        onChange={mockOnChange}
        maxChildren={3}
      />
    )

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const incrementButton = screen.getByLabelText("Increase bambini")
      expect(incrementButton.hasAttribute("disabled")).toBe(true)
    })
  })

  test("does not call onChange until confirm is clicked", async () => {
    let changeCallCount = 0
    const handleChange = (guests: GuestData) => {
      changeCallCount++
    }

    render(
      <GuestSelector
        value={{ adults: 2, children: 0 }}
        onChange={handleChange}
      />
    )

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const incrementButton = screen.getByLabelText("Increase adulti")
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
    })

    // onChange should not have been called yet
    expect(changeCallCount).toBe(0)

    const confirmButton = screen.getByText("Conferma")
    fireEvent.click(confirmButton)

    // Now onChange should be called
    await waitFor(() => {
      expect(changeCallCount).toBe(1)
    })
  })

  test("resets to original value when popover is closed without confirming", async () => {
    const { rerender } = render(
      <GuestSelector
        value={{ adults: 2, children: 0 }}
        onChange={mockOnChange}
      />
    )

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      const incrementButton = screen.getByLabelText("Increase adulti")
      fireEvent.click(incrementButton)
    })

    // Close popover without confirming (click outside)
    fireEvent.keyDown(document, { key: "Escape" })

    // Re-open and verify value is still 2
    await waitFor(() => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      const adultsValue = screen.getAllByText("2")[0]
      expect(adultsValue).toBeDefined()
    })
  })

  test("disables the button when disabled prop is true", () => {
    render(
      <GuestSelector
        value={mockValue}
        onChange={mockOnChange}
        disabled={true}
      />
    )

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    expect(button.hasAttribute("disabled")).toBe(true)
  })

  test("applies custom className", () => {
    const { container } = render(
      <GuestSelector
        value={mockValue}
        onChange={mockOnChange}
        className="custom-class"
      />
    )

    const button = container.querySelector("button")
    expect(button?.classList.contains("custom-class")).toBe(true)
  })

  test("closes popover after confirming selection", async () => {
    render(<GuestSelector value={mockValue} onChange={mockOnChange} />)

    const button = screen.getByRole("button", { name: "Seleziona ospiti" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText("Conferma")).toBeDefined()
    })

    const confirmButton = screen.getByText("Conferma")
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.queryByText("Conferma")).toBeNull()
    })
  })
})
