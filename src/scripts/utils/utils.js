function isAlphabet(char) {
  let arr = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]
  return arr.some(a => a === char)
}

function isDegit(char) {
  let arr = [..."0123456789"]
  return arr.some(a => a === char)
}

function isNumeric(char) {
  let arr = [..."0123456789.-"]
  return arr.some(a => a === char)
}

function isAlphaDegit(char) {
  return isAlphabet(char) || isDegit(char)
}

function isAlphaNumeric(char) {
  return isAlphabet(char) || isNumeric(char)
}

function isSpace(char) {
  return char === " " || char === "\t" || char === "\v"
}

function isSpecialChar(char) {
  let arr = [..."!@#$%^&*()-_=+[{]};:'\"\\|/?.>,<~`"]
  return arr.some(a => a === char)
}

export function padZero(number) {
  if (number < 10) return `0${number}`
  else return `${number}`
}

export function focus(element) {
  let type = element.type

  if ("date" === type) element.focus()
  else {
    element.selectionStart = 0
    element.selectionEnd = element.value.length
    element.focus()
  }
}

export function delayFocus(element, delay = 300) {
  setTimeout(() => {
    focus(element)
  }, delay)
}

export function enterToNextInput(inputList) {
  let length = inputList.length - 1

  for (let i = 0; i < length; i++) {
    let next = inputList[i + 1]
    inputList[i].addEventListener("keyup", e =>
      "Enter" === e.key ? focus(next) : ""
    )
    inputList[i].addEventListener("next", _ => focus(next))
  }
}

export function mobileInput(element) {
  const handler = e => {
    e.preventDefault()

    let key = e.key
    let value = element.value
    let length = value.length

    let selectionStart = element.selectionStart
    let selectionEnd = element.selectionEnd
    let chunk1 = value.slice(0, selectionStart)
    let chunk2 = value.slice(selectionEnd, length)

    if (isDegit(key)) {
      if (length >= 12) return
      if (length === 0 && key !== "0") return
      if (length === 1 && key !== "1") return
      if (length === 5 && key !== "-") {
        element.value = chunk1 + "-" + key + chunk2
        element.selectionStart = chunk1.length + 2
        element.selectionEnd = chunk1.length + 2
        return
      }

      element.value = chunk1 + key + chunk2
      element.selectionStart = chunk1.length + 1
      element.selectionEnd = chunk1.length + 1
      return
    }

    if (key === "-" && length === 5) {
      element.value = chunk1 + key + chunk2
      element.selectionStart = chunk1.length + 1
      element.selectionEnd = chunk1.length + 1
      return
    }

    if (key === "ArrowLeft") {
      element.selectionStart = selectionStart - 1 >= 0 ? selectionStart - 1 : 0
      element.selectionEnd = selectionStart - 1 >= 0 ? selectionStart - 1 : 0
    }

    if (key === "ArrowRight") {
      element.selectionStart =
        selectionEnd + 1 <= length ? selectionEnd + 1 : length
      element.selectionEnd =
        selectionEnd + 1 <= length ? selectionStart + 1 : length
    }

    if (key === "Backspace") {
      if (selectionStart === selectionEnd)
        selectionStart = selectionStart - 1 >= 0 ? selectionStart - 1 : 0

      let chunk1 = value.slice(0, selectionStart)
      let chunk2 = value.slice(selectionEnd, length)

      element.value = chunk1 + chunk2
      element.selectionStart = chunk1.length
      element.selectionEnd = chunk1.length
    }

    if (key === "Tab") element.dispatchEvent(new Event("next"))
  }

  element.addEventListener("keydown", handler)
}

export function suggestionHandler(element, suggetionElement, renderer) {
  let currentSelection = -1

  function clearSelection() {
    let allSuggetion = suggetionElement.querySelectorAll("div")
    allSuggetion.forEach(suggetion => {
      suggetion.classList.remove("selected")
    })
  }

  element.addEventListener("focus", () => {
    renderer(element.value.trim())

    if (suggetionElement.innerHTML === "") {
      suggetionElement.classList.add("hidden")
    } else suggetionElement.classList.remove("hidden")
  })

  element.addEventListener("blur", () => {
    setTimeout(() => {
      suggetionElement.innerHTML = ""
      suggetionElement.classList.add("hidden")
    }, 150)
  })

  element.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") {
      clearSelection()
      let allSuggetion = suggetionElement.querySelectorAll(" & > div")

      if (allSuggetion.length) {
        currentSelection + 1 < allSuggetion.length
          ? currentSelection++
          : (currentSelection = 0)
        allSuggetion[currentSelection].classList.add("selected")
        allSuggetion[currentSelection].scrollIntoView(false)
      } else currentSelection = -1
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      clearSelection()
      e.target.selectionStart = e.target.value.length
      e.target.selectionEnd = e.target.value.length

      let allSuggetion = suggetionElement.querySelectorAll(" & > div")

      if (allSuggetion.length) {
        currentSelection - 1 > -1
          ? currentSelection--
          : (currentSelection = allSuggetion.length - 1)
        allSuggetion[currentSelection].classList.add("selected")
        allSuggetion[currentSelection].scrollIntoView(false)
      } else currentSelection = -1
    }
  })

  element.addEventListener("keyup", e => {
    if (e.key === "Enter") {
      e.target.value =
        suggetionElement.querySelector("div.selected span.suggetionDataSpan")
          ?.innerText || e.target.value

      suggetionElement.dataset.id =
        suggetionElement.querySelector("div.selected span.suggetionIdSpan")
          ?.innerText || e.target.dataset.id

      clearSelection()
      currentSelection = -1
      suggetionElement.classList.add("hidden")
    } else if (e.key === "Escape") {
      currentSelection = -1
      suggetionElement.dataset.id = 0
      e.target.dispatchEvent(new Event("blur"))
    } else if (
      isAlphaDegit(e.key) ||
      isSpace(e.key) ||
      isSpecialChar(e.key) ||
      e.key === "Backspace"
    ) {
      suggetionElement.innerHTML = ""
      suggetionElement.dataset.id = 0
      clearSelection()
      currentSelection = -1

      renderer(e.target.value)

      let allSuggetion = suggetionElement.querySelectorAll("div")
      if (allSuggetion.length) suggetionElement.classList.remove("hidden")
      else suggetionElement.classList.add("hidden")
    }
  })

  suggetionElement.addEventListener(
    "click",
    e => {
      let clicked = e.target.closest("div.suggetion > div")
      suggetionElement.querySelectorAll("div").forEach(d => {
        if (d === clicked) {
          element.value = clicked.querySelector(
            "span.suggetionDataSpan"
          ).innerText
          suggetionElement.dataset.id = clicked.querySelector(
            "span.suggetionIdSpan"
          ).innerText
          clearSelection()

          element.dispatchEvent(new Event("next"))
        }
      })
    },
    true
  )
}

export function intInput(element, min = -Infinity, max = Infinity) {
  element.addEventListener("keydown", e => {
    e.preventDefault()

    let key = e.key
    let value = element.value
    let length = element.value.length

    let selectionStart = element.selectionStart
    let selectionEnd = element.selectionEnd
    let chunk1 = value.slice(0, selectionStart)
    let chunk2 = value.slice(selectionEnd, length)

    if (key === "-" && length === 0 && min < 0) {
      element.value = "-"
      element.selectionStart = 1
      element.selectionEnd = 1
      return
    }

    if (isDegit(key)) {
      let nextValue = chunk1 + key + chunk2

      let isValidInt = nextValue <= max && nextValue >= min
      let isOverflow = nextValue > max
      let isUnderflow = nextValue < min

      if (isValidInt) {
        element.value = nextValue
        element.selectionStart = (chunk1 + key).length
        element.selectionEnd = (chunk1 + key).length
        return
      }

      if (isOverflow) {
        element.value = max
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }

      if (isUnderflow) {
        element.value = min
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }
    }

    if (key === "ArrowUp") {
      element.value = Number(value) + 1 <= max ? Number(value) + 1 : max
      element.selectionStart = element.value.length
      element.selectionEnd = element.value.length
      return
    }

    if (key === "ArrowDown") {
      element.value = Number(value) - 1 >= min ? Number(value) - 1 : min
      element.selectionStart = element.value.length
      element.selectionEnd = element.value.length
      return
    }

    if (key === "ArrowLeft") {
      element.selectionStart = selectionStart - 1 >= 0 ? selectionStart - 1 : 0
      element.selectionEnd = selectionStart - 1 >= 0 ? selectionStart - 1 : 0
      return
    }

    if (key === "ArrowRight") {
      element.selectionStart =
        selectionEnd + 1 <= length ? selectionEnd + 1 : length
      element.selectionEnd =
        selectionEnd + 1 <= length ? selectionStart + 1 : length

      return
    }

    if (key === "Backspace") {
      if (selectionStart === selectionEnd)
        selectionStart = selectionStart - 1 >= 0 ? selectionStart - 1 : 0

      let chunk1 = value.slice(0, selectionStart)
      let chunk2 = value.slice(selectionEnd, length)

      let nextValue = chunk1 + chunk2

      let isValidInt = nextValue <= max && nextValue >= min
      let isOverflow = nextValue > max
      let isUnderflow = nextValue < min

      if (isValidInt) {
        element.value = nextValue
        element.selectionStart = chunk1.length
        element.selectionEnd = chunk1.length
        return
      }

      if (isOverflow) {
        element.value = max
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }

      if (isUnderflow) {
        element.value = nextValue === "" ? "" : min
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }
    }

    if (key === "Tab") element.dispatchEvent(new Event("next"))
  })
}

export function floatInput(element, min = -Infinity, max = Infinity) {
  function haveNotDot(value) {
    return ![...value].some(v => v === ".")
  }

  element.addEventListener("keydown", e => {
    e.preventDefault()

    let key = e.key
    let value = element.value
    let length = element.value.length

    let selectionStart = element.selectionStart
    let selectionEnd = element.selectionEnd
    let chunk1 = value.slice(0, selectionStart)
    let chunk2 = value.slice(selectionEnd, length)

    if (key === "-" && length === 0 && min < 0) {
      element.value = "-"
      element.selectionStart = 1
      element.selectionEnd = 1
      return
    }

    if (key === "." && length === 0 && min < 0) {
      element.value = "."
      element.selectionStart = 1
      element.selectionEnd = 1
      return
    }

    if (isDegit(key)) {
      let nextValue = chunk1 + key + chunk2

      let isValidInt = nextValue <= max && nextValue >= min
      let isOverflow = nextValue > max
      let isUnderflow = nextValue < min

      if (isValidInt) {
        element.value = nextValue
        element.selectionStart = (chunk1 + key).length
        element.selectionEnd = (chunk1 + key).length
        return
      }

      if (isOverflow) {
        element.value = max
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }

      if (isUnderflow) {
        element.value = min
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }
    }

    if (key === "." && haveNotDot(value)) {
      let nextValue = chunk1 + key + chunk2
      element.value = nextValue
      element.selectionStart = (chunk1 + key).length
      element.selectionEnd = (chunk1 + key).length
    }

    if (key === "ArrowUp") {
      element.value = Number(value) + 1 <= max ? Number(value) + 1 : max
      element.selectionStart = element.value.length
      element.selectionEnd = element.value.length
      return
    }

    if (key === "ArrowDown") {
      element.value = Number(value) - 1 >= min ? Number(value) - 1 : min
      element.selectionStart = element.value.length
      element.selectionEnd = element.value.length
      return
    }

    if (key === "ArrowLeft") {
      element.selectionStart = selectionStart - 1 >= 0 ? selectionStart - 1 : 0
      element.selectionEnd = selectionStart - 1 >= 0 ? selectionStart - 1 : 0
      return
    }

    if (key === "ArrowRight") {
      element.selectionStart =
        selectionEnd + 1 <= length ? selectionEnd + 1 : length
      element.selectionEnd =
        selectionEnd + 1 <= length ? selectionStart + 1 : length

      return
    }

    if (key === "Backspace") {
      if (selectionStart === selectionEnd)
        selectionStart = selectionStart - 1 >= 0 ? selectionStart - 1 : 0

      let chunk1 = value.slice(0, selectionStart)
      let chunk2 = value.slice(selectionEnd, length)

      let nextValue = chunk1 + chunk2

      let isValidInt = nextValue <= max && nextValue >= min
      let isOverflow = nextValue > max
      let isUnderflow = nextValue < min

      if (isValidInt) {
        element.value = nextValue
        element.selectionStart = chunk1.length
        element.selectionEnd = chunk1.length
        return
      }

      if (isOverflow) {
        element.value = max
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }

      if (isUnderflow) {
        element.value = nextValue === "" ? "" : min
        element.selectionStart = element.value.length
        element.selectionEnd = element.value.length
        return
      }
    }

    if (key === "Tab") element.dispatchEvent(new Event("next"))
  })
}
