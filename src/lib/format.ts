export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getMonthRange(date = new Date()): { start: string; end: string } {
  const year = date.getFullYear()
    const month = date.getMonth()
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    return { start: toISO(start), end: toISO(end) }
}

export function currentMonthLabel(date = new Date()): string {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}
