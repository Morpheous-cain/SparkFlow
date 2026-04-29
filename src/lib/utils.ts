import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 👇 ADD THIS (GLOBAL REGISTER)
if (typeof globalThis !== "undefined") {
  (globalThis as any).cn = cn;
}