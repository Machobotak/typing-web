"use client";

interface OptionGroupOption {
  value: string;
  label: string;
}

interface OptionGroupProps {
  label: string;
  value: string;
  options: readonly OptionGroupOption[];
  onChange: (value: string) => void;
}

export default function OptionGroup({
  label,
  value,
  options,
  onChange,
}: OptionGroupProps) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`rounded px-2 py-1 text-sm transition-colors focus-visible:outline-1 focus-visible:outline-white ${
              active ? "text-primary" : "text-secondary hover:text-primary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
