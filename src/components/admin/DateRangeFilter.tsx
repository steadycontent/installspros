import { useState } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DateRange = {
  from: Date;
  to: Date;
};

type PresetKey = "today" | "yesterday" | "7days" | "14days" | "30days" | "custom";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const presets: { key: PresetKey; label: string; getDates: () => DateRange }[] = [
  {
    key: "today",
    label: "Today",
    getDates: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    key: "yesterday",
    label: "Yesterday",
    getDates: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    key: "7days",
    label: "Last 7 days",
    getDates: () => ({
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date()),
    }),
  },
  {
    key: "14days",
    label: "Last 14 days",
    getDates: () => ({
      from: startOfDay(subDays(new Date(), 14)),
      to: endOfDay(new Date()),
    }),
  },
  {
    key: "30days",
    label: "Last 30 days",
    getDates: () => ({
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    }),
  },
];
export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetKey>("today");

  const handlePresetClick = (preset: typeof presets[0]) => {
    setActivePreset(preset.key);
    onChange(preset.getDates());
    setIsOpen(false);
  };

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // If no from date or both dates are set, start new range
    if (!value.from || (value.from && value.to)) {
      onChange({ from: date, to: date });
    } else {
      // Set the to date
      const newRange = date < value.from 
        ? { from: date, to: value.from }
        : { from: value.from, to: date };
      onChange(newRange);
      setActivePreset("custom");
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Preset buttons */}
      <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-lg p-1">
        {presets.map((preset) => (
          <Button
            key={preset.key}
            variant={activePreset === preset.key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handlePresetClick(preset)}
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom date picker */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={activePreset === "custom" ? "secondary" : "outline"}
            size="sm"
            className={cn(
              "justify-start text-left font-normal",
              activePreset !== "custom" && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {activePreset === "custom" ? (
              <>
                {format(value.from, "MMM d")} - {format(value.to, "MMM d, yyyy")}
              </>
            ) : (
              "Custom range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={{ from: value.from, to: value.to }}
            onSelect={(range) => {
              if (range?.from) {
                onChange({
                  from: range.from,
                  to: range.to || range.from,
                });
                if (range.to) {
                  setActivePreset("custom");
                  setIsOpen(false);
                }
              }
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
