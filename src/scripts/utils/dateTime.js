function padZero(number) {
  if(number < 10) return `0${number}`
  else return `${number}`
}

export function getDateTime(dateObj) {
  let date = padZero(dateObj.getDate())
  let month = padZero(dateObj.getMonth() + 1)
  let year = dateObj.getFullYear()

  let hours = padZero(dateObj.getHours())
  let minutes = padZero(dateObj.getMinutes())

  return `${hours}:${minutes} on ${date}/${month}/${year}`
}

export function getTime(dateObj) {
  let hours = padZero(dateObj.getHours())
  let minutes = padZero(dateObj.getMinutes())

  return `${hours}:${minutes}`
}

export function getDate(dateObj) {
  let date = padZero(dateObj.getDate())
  let month = padZero(dateObj.getMonth() + 1)
  let year = dateObj.getFullYear()

  return `${date}/${month}/${year}`
}