import * as React from "react"
import {Check, MapPin} from "lucide-react"
import {cn} from "../../lib/utils"
import type {LocationComboboxProps} from "../../types/booking"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "./ui/popover"

/** Default translations for LocationCombobox */
const defaultLocationTranslations = {
    destination: "Destination",
    whereToGo: "Where do you want to go?",
    searchDestination: "Search a destination...",
    noLocationFound: "No location found.",
}

export function LocationCombobox({
                                     locations,
                                     value,
                                     onChange,
                                     placeholder,
                                     disabled = false,
                                     className,
                                     tabIndex,
                                     title,
                                     translations: userTranslations,
                                 }: LocationComboboxProps) {
    const [open, setOpen] = React.useState(false)

    // Merge user translations with defaults (also support deprecated props for backwards compatibility)
    const t = React.useMemo(() => ({
        ...defaultLocationTranslations,
        ...userTranslations,
        // Support deprecated props
        ...(title && { destination: title }),
        ...(placeholder && { whereToGo: placeholder }),
    }), [userTranslations, title, placeholder])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select location"
                    disabled={disabled}
                    tabIndex={tabIndex}
                    className={cn(
                        "flex h-14 w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:border-blue-600 focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                >
                    <MapPin className="h-5 w-5 text-slate-500 flex-shrink-0" aria-hidden="true"/>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-medium text-slate-500">{t.destination}</span>
                        {value ? (
                            <span className="font-medium text-slate-900 truncate">{value.name}</span>
                        ) : (
                            <span className="text-slate-400 truncate">{t.whereToGo}</span>
                        )}
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                    <CommandInput placeholder={t.searchDestination}/>
                    <CommandList>
                        <CommandEmpty>{t.noLocationFound}</CommandEmpty>
                        <CommandGroup>
                            {locations.map((location) => (
                                <CommandItem
                                    key={location.id}
                                    value={location.name}
                                    onSelect={() => {
                                        onChange(location.id === value?.id ? null : location)
                                        setOpen(false)
                                    }}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-500" aria-hidden="true"/>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{location.name}</span>
                                            {location.type && (
                                                <span className="text-xs text-slate-500">{location.type}</span>
                                            )}
                                        </div>
                                    </div>
                                    <Check
                                        className={cn(
                                            "h-4 w-4",
                                            value?.id === location.id ? "opacity-100" : "opacity-0"
                                        )}
                                        aria-hidden="true"
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
