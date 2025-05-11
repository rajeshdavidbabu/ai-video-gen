import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getShortsThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/oar2.jpg`;
}
