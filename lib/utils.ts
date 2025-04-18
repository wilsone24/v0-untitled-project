import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const diffInMs = now.getTime() - date.getTime()
  const diffInSecs = Math.floor(diffInMs / 1000)
  const diffInMins = Math.floor(diffInSecs / 60)
  const diffInHours = Math.floor(diffInMins / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInSecs < 60) {
    return "hace unos segundos"
  } else if (diffInMins < 60) {
    return `hace ${diffInMins} ${diffInMins === 1 ? "minuto" : "minutos"}`
  } else if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`
  } else if (diffInDays < 7) {
    return `hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`
  } else {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}
