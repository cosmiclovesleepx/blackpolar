import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper estándar de shadcn — combina clases de Tailwind sin conflictos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
