import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date into a relative time string (e.g., "5 minutes ago").
 * A lightweight alternative to larger libraries for simple use cases.
 *
 * @param {Date | string} date - The date to format.
 * @param {Date} [now=new Date()] - The current date, for testing purposes.
 * @returns {string} The formatted relative time string.
 */
export function formatRelativeTime(
    date: Date | string,
    now: Date = new Date()
): string {
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  if (seconds < 10) return "just now";

  return Math.floor(seconds) + " seconds ago";
}