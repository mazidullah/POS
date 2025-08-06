function padZeroDate(num) {
  if (num < 10) return "0" + num
  else return "" + num
}

function padZeroMonth(num) {
  if (num < 10) return "0" + (num + 1)
  else return "" + (num + 1)
}

function padZeroYear(num) {
  if (num >= 1000) return "" + num
  else if (num >= 100) return "0" + num
  else if (num >= 10) return "00" + num
  else if (num >= 0) return "000" + num
}

export function getDateTime(date = new Date()) {
  let dd = padZeroDate(date.getDate())
  let mm = padZeroMonth(date.getMonth())
  let yy = padZeroYear(date.getFullYear())

  let hours = padZeroDate(date.getHours())
  let minutes = padZeroDate(date.getMinutes())

  return `${hours}:${minutes} on ${dd}/${mm}/${yy}`
}

export function getTime(date) {
  let hours = padZeroDate(date.getHours())
  let minutes = padZeroDate(date.getMinutes())

  return `${hours}:${minutes}`
}

export function getDate(date) {
  let dd = padZeroDate(date.getDate())
  let mm = padZeroMonth(date.getMonth())
  let yy = padZeroYear(date.getFullYear())

  return `${dd}/${mm}/${yy}`
}

export function setDate(element, date = new Date(0)) {
  let dd = padZeroDate(date.getDate())
  let mm = padZeroMonth(date.getMonth())
  let yy = padZeroYear(date.getFullYear())

  element.value = `${yy}-${mm}-${dd}`
}
