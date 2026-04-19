"use client";

import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DARK_VARS = {
  "--background": "oklch(0.145 0 0)",
  "--foreground": "oklch(0.985 0 0)",
  "--muted": "oklch(0.269 0 0)",
  "--muted-foreground": "oklch(0.708 0 0)",
  "--accent": "oklch(0.269 0 0)",
  "--accent-foreground": "oklch(0.985 0 0)",
  "--primary": "oklch(0.45 0.20 15)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--popover": "oklch(0.145 0 0)",
  "--popover-foreground": "oklch(0.985 0 0)",
  "--border": "oklch(1 0 0 / 10%)",
  "--ring": "oklch(0.556 0 0)",
} as React.CSSProperties;

function splitValue(value: string): { datePart: string; timePart: string } {
  if (!value) return { datePart: "", timePart: "00:00" };
  const idx = value.indexOf("T");
  if (idx === -1) return { datePart: value, timePart: "00:00" };
  return { datePart: value.slice(0, idx), timePart: value.slice(idx + 1) };
}

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const { datePart, timePart } = splitValue(value);
  const parsed = datePart ? parseISO(datePart) : undefined;
  const selected = parsed && isValid(parsed) ? parsed : undefined;

  function handleSelectDate(date: Date | undefined) {
    const dp = date ? format(date, "yyyy-MM-dd") : "";
    onChange(dp ? `${dp}T${timePart}` : "");
    setOpen(false);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const tp = e.target.value;
    const dp = datePart || format(new Date(), "yyyy-MM-dd");
    onChange(`${dp}T${tp}`);
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "flex-1 justify-between font-normal h-8 px-2.5 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:text-white",
              selected ? "text-white" : "text-neutral-500",
            )}
          >
            {selected
              ? format(selected, "d 'de' MMMM yyyy", { locale: es })
              : placeholder}
            <ChevronDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 bg-neutral-900 border-neutral-800"
          align="start"
          style={DARK_VARS}
        >
          <Calendar
            mode="single"
            selected={selected}
            captionLayout="dropdown"
            defaultMonth={selected}
            locale={es}
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>

      <Input
        type="time"
        value={timePart}
        onChange={handleTimeChange}
        disabled={disabled}
        className="w-28 h-8 bg-neutral-800 border-neutral-700 text-white appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
}
