import dayjs from "dayjs"

export function formatDate(time: number) {
  const date = dayjs(time / 1000)
  return date.format('ddd, MM/DD-YYYY')
}

export function formatTime(time: number) {
  const date = dayjs(time / 1000)
  return  date.format('hh:mm:ss')
}

export function diffTime(start: number, end: number, eliminate = false, format = 'ms') {
  if (start === 0) {
    return "-"
  }

  const pref = eliminate ? 'Stand: ' : ''

  return pref + dayjs(dayjs.unix(start / (format === 's' ? 1000000 : 1000)))
    .diff(dayjs.unix(end / (format === 's' ? 1000000 : 1000)), 
      (format === 's' ? 'second' : 'millisecond')) +format
}