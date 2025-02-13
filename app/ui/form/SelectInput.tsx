import type React from "react";
import { useState, useRef, useEffect } from "react";
import { joinClasses } from "@/lib/utils/strings";
import { BiChevronUp } from "react-icons/bi";

interface SelectInputProps {
  options: { label: string; value: string | number }[];
  ctaText?: string;
  onChange?: (value: string | number) => void;
  value?: string | number;
  className?: string;
  classNameContainer?: string;
  error?: boolean;
  hideDropdown?: boolean;
}

export default function SelectInput({
  options,
  ctaText = "Select",
  onChange,
  value,
  className = "",
  classNameContainer,
  error = false,
  hideDropdown = false,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(hideDropdown);
  const [selectedLabel, setSelectedLabel] = useState(ctaText);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: { label: string; value: string | number }) => {
    setSelectedLabel(option.label);
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(hideDropdown); // Close dropdown after selection
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex < options.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : options.length - 1
      );
    } else if (event.key === "Tab" && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(hideDropdown);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideDropdown]);

  useEffect(() => {
    if (focusedIndex !== -1 && isOpen) {
      const optionElement = dropdownRef.current?.querySelector(
        `li:nth-child(${focusedIndex + 1})`
      );
      if (optionElement) {
        (optionElement as HTMLElement).focus();
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className={`${classNameContainer} relative w-full`} ref={dropdownRef}>
      {/* Custom Button */}
      {!hideDropdown && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={joinClasses(
            className,
            "placeholder:text-slate-400 text-slate-700 text-sm",
            "w-full border border-slate-200 bg-transparent rounded-md px-3 py-2 transition",
            "duration-300 ease focus:outline-none focus:border-slate-400",
            "hover:border-slate-300 shadow-sm focus:shadow",
            "flex items-center justify-between",
            {
              "border-red-500": error,
            }
          )}
        >
          <span>{selectedLabel}</span>
          <BiChevronUp
            className={joinClasses("text-lg duration-300 transition-all", {
              "rotate-180": isOpen,
            })}
          />
        </button>
      )}

      {/* Dropdown Options */}
      {isOpen && (
        <div
          className={joinClasses(
            "absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-slate-200",
            {
              "h-30 overflow-y-scroll": hideDropdown,
            }
          )}
        >
          <ul className="py-1">
            {options.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSelect(option);
                  }
                }}
                tabIndex={focusedIndex}
                aria-selected={value === option.value}
                className={joinClasses(
                  "px-3 py-2 text-sm cursor-pointer",
                  "transition-colors duration-200",
                  {
                    "hover:bg-slate-100 ": !hideDropdown,
                    "bg-slate-100": value === option.value,
                    "bg-blue-500 hover:bg-blue-500 text-white":
                      selectedLabel === option.label && hideDropdown,
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
