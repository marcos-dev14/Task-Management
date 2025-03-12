export function formatSendDate(dateString: string) {
  const date = new Date(dateString)

  return date.toISOString() // Converte para "2025-03-11T18:52:00.000Z"
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const formattedTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return `${formattedDate} às ${formattedTime}`
}