'use client'

/**
 *  Formats a timestamp into a string with various display options
 *  @param timestamp - Unix timestamp in milliseconds
 *  @param format - Output format
 *  @returns Formatted string
 */
export const formatTimeUtil = (
  timestamp: string,
  format: 'time' | 'date' | 'datetime' | 'timeAndDate' | 'year' | 'full' = 'time'
): string => {
  const date = new Date(timestamp)

  const formats = {
    time: {
      hour: '2-digit',
      minute: '2-digit'
    } as Intl.DateTimeFormatOptions,

    date: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    } as Intl.DateTimeFormatOptions,

    timeAndDate: {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      year: 'numeric',
      month: '2-digit'
    } as Intl.DateTimeFormatOptions,

    datetime: {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    } as Intl.DateTimeFormatOptions,

    full: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    } as Intl.DateTimeFormatOptions,

    year: {
      year: 'numeric'
    } as Intl.DateTimeFormatOptions
  }

  return date.toLocaleString('ru-RU', formats[format])
}
