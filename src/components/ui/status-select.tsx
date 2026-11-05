"use client";

import { cn } from "../../lib/utils";
import type { FieldSize } from "./control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { type StatusTone, statusDotClass } from "./status-tone";

export interface StatusOption {
  value: string;
  label: string;
  tone?: StatusTone;
}

export interface StatusSelectProps {
  /** Current status. Pass "" when nothing is chosen yet. */
  value: string;
  /** Statuses the field knows about, including the current one. */
  options: readonly StatusOption[];
  /**
   * Status values the person may move to.
   * The current value stays visible. Anything else is omitted.
   */
  allowed: readonly string[];
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: FieldSize;
  name?: string;
  id?: string;
  placeholder?: string;
  "aria-label"?: string;
}

/** True when `next` is a real move listed in `allowed`. */
export function canChangeStatus(
  current: string,
  next: string,
  allowed: readonly string[],
): boolean {
  return next !== current && allowed.includes(next);
}

/**
 * Options to show: the current status, plus allowed transitions that exist
 * in `options`. Unknown allowed values are dropped. The current value is
 * kept even when it is not a legal next move.
 */
export function visibleStatusOptions(
  options: readonly StatusOption[],
  value: string,
  allowed: readonly string[],
): StatusOption[] {
  const allowedSet = new Set(allowed);
  const seen = new Set<string>();
  const known = options.some((option) => option.value === value);
  const source: StatusOption[] =
    known || value === "" ? [...options] : [{ value, label: value, tone: "scheduled" }, ...options];
  const visible: StatusOption[] = [];
  for (const option of source) {
    if (option.value === "" || seen.has(option.value)) continue;
    if (option.value !== value && !allowedSet.has(option.value)) continue;
    seen.add(option.value);
    visible.push(option);
  }
  return visible;
}

function StatusSelect({
  value,
  options,
  allowed,
  onValueChange,
  disabled = false,
  size = "lg",
  name,
  id,
  placeholder = "Choose a status",
  "aria-label": ariaLabel = "Status",
}: StatusSelectProps) {
  const choices = visibleStatusOptions(options, value, allowed);
  const locked = disabled || !choices.some((option) => option.value !== value);

  function handleValueChange(next: string) {
    if (!canChangeStatus(value, next, allowed)) return;
    onValueChange?.(next);
  }

  return (
    <Select
      value={value === "" ? undefined : value}
      onValueChange={handleValueChange}
      disabled={locked}
      name={name}
    >
      <SelectTrigger id={id} size={size} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {choices.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  statusDotClass[option.tone ?? "scheduled"],
                )}
              />
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { StatusSelect };
