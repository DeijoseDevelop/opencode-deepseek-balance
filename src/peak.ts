const PEAK_WINDOWS_UTC = [
  [1, 4],
  [6, 10],
] as const

export function isPeak(date: Date): boolean {
  const day = date.getUTCDay()
  if (day === 0 || day === 6) return false
  const hour = date.getUTCHours()
  return PEAK_WINDOWS_UTC.some(([start, end]) => hour >= start && hour < end)
}

export function nextPeakChange(from: Date): Date | undefined {
  const current = isPeak(from)
  const cursor = new Date(from)
  cursor.setUTCMinutes(0, 0, 0)
  cursor.setUTCHours(cursor.getUTCHours() + 1)
  for (let i = 0; i < 24 * 8; i++) {
    if (isPeak(cursor) !== current) return cursor
    cursor.setUTCHours(cursor.getUTCHours() + 1)
  }
  return undefined
}

export function countdown(date: Date, from: Date): string {
  const minutes = Math.max(1, Math.ceil((date.getTime() - from.getTime()) / 60_000))
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours > 0 ? `${hours}h ${String(rest).padStart(2, "0")}m` : `${rest}m`
}
