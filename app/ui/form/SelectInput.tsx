import React, { useState, useRef, useEffect } from "react";
import { joinClasses } from "@/lib/utils/strings";

interface SelectInputProps {
  options: {
    label: string;
    value: string | number;
  }[]; // Array of options for the select field
  ctaText?: string; // Call-to-action text for the default option
  onChange?: (value: string | number) => void; // Optional onChange handler
  value?: string | number; // Optional value for controlled input
  className?: string; // Optional additional class names
  error?: boolean; // Optional error state
}

export default function SelectInput({
  options,
  ctaText = "Select",
  onChange,
  value,
  className = "",
  error = false,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const [selectedLabel, setSelectedLabel] = useState(ctaText); // State to manage selected label
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  // Handle option selection
  const handleSelect = (option: { label: string; value: string | number }) => {
    setSelectedLabel(option.label);
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false); // Close dropdown after selection
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Custom Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={joinClasses(
          "placeholder:text-slate-400 text-slate-700 text-sm",
          "w-full border border-slate-200 bg-transparent rounded-md px-3 py-2 transition",
          "duration-300 ease focus:outline-none focus:border-slate-400",
          "hover:border-slate-300 shadow-sm focus:shadow",
          "flex items-center justify-between",
          {
            "border-red-500": error,
          },
          className
        )}
      >
        <span>{selectedLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-slate-200">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={joinClasses(
                  "px-3 py-2 text-sm text-slate-700 cursor-pointer",
                  "hover:bg-slate-100 transition-colors duration-200",
                  {
                    "bg-slate-100": value === option.value,
                  }
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
