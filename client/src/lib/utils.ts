import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isImageFile(name: string) {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const extension = name.split(".").pop();
  return imageExtensions.includes(extension!);
}

export function isVideoFile(name: string) {
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "mkv"];
  const extension = name.split(".").pop();
  return videoExtensions.includes(extension!);
}

export function isDocumentFile(name: string) {
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
  ];
  const extension = name.split(".").pop();
  return documentExtensions.includes(extension!);
}

export function isTauri() {
  return typeof window !== "undefined" && (window as any).__TAURI__;
}
