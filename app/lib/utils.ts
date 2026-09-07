import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/")
}

export function isUnderMaxSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024
}

export function reorder<T>(array: T[], from: number, to: number): T[] {
  const next = [...array];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function remove<T>(array: T[], id: string, key: keyof T): T[] {
  return array.filter((item) => item[key] !== id);
}
