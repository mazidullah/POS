function isAlphabet(char) {
  let arr = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]
  return arr.some(a => a === char)
}

function isNumeric(char) {
  let arr = [..."0123456789"]
  return arr.some(a => a === char)
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

export function enterToNextInput(inputList) {
  for (let i = 0; i < inputList.length - 1; i++) {
    inputList[i].addEventListener("keyup", e => {
      if (e.key === "Enter") {
        if (inputList[i + 1].type === "date") {
          focus(inputList[i + 1])
        } else {
          inputList[i + 1].selectionStart = 0
          inputList[i + 1].selectionEnd = inputList[i + 1].value.length
          focus(inputList[i + 1])
        }
      }
    })
  }
}

export function mobileInput(selector) {
  selector.addEventListener("keydown", e => {
    e.preventDefault()

    let value = e.target.value
    let length = value.length
    let selectionStart = e.target.selectionStart
    let selectionEnd = e.target.selectionEnd

    let chunk1 = value.slice(0, selectionStart)
    let chunk2 = value.slice(selectionEnd, length)

    if (e.key >= "0" && e.key <= "9") {
      if (e.target.value.length >= 12) return
      if (e.target.value.length === 0 && e.key !== "0") return
      if (e.target.value.length === 1 && e.key !== "1") return
      if (e.target.value.length === 5 && e.key !== "-") {
        e.target.value = chunk1 + "-" + e.key + chunk2
        e.target.selectionStart = chunk1.length + 2
        e.target.selectionEnd = chunk1.length + 2
        return
      }

      e.target.value = chunk1 + e.key + chunk2
      e.target.selectionStart = chunk1.length + 1
      e.target.selectionEnd = chunk1.length + 1
    }

    if (e.key === "-" && e.target.value.length === 5) {
      e.target.value = chunk1 + e.key + chunk2
      e.target.selectionStart = chunk1.length + 1
      e.target.selectionEnd = chunk1.length + 1
    }

    if (e.key === "Backspace") {
      if (selectionStart === selectionEnd) {
        selectionStart =
          e.target.selectionStart - 1 >= 0 ? e.target.selectionStart - 1 : 0
      }

      let chunk1 = value.slice(0, selectionStart)
      let chunk2 = value.slice(selectionEnd, length)

      e.target.value = chunk1 + chunk2
      e.target.selectionStart = chunk1.length
      e.target.selectionEnd = chunk1.length
    }
  })
}

export function focus(element) {
  if (element.type === "date") {
    element.focus()
  } else {
    element.selectionStart = 0
    element.selectionEnd = element.value.length
    element.focus()
  }
}

export function delayFocus(element, delay = 60) {
  setTimeout(() => {
    focus(element)
  }, delay)
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
      isAlphaNumeric(e.key) ||
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
        }
      })
    },
    true
  )
}

export function intInput(element) {
  element.addEventListener("keydown", e => {
    e.preventDefault()
    let value = "" + (Number(e.target.value) > 0 ? Number(e.target.value) : "")

    if (e.key >= "0" && e.key <= "9") {
      if (
        e.key === "0" &&
        e.target.value.length === 1 &&
        e.target.value === "0"
      )
        return
      e.target.value = Number(value + e.key)
    } else if (e.key === "ArrowUp") {
      let current = Number(value)
      current++
      e.target.value = current
    } else if (e.key === "ArrowDown") {
      let current = Number(value)
      current = current - 1 >= 0 ? current - 1 : 0
      e.target.value = current
    } else if (e.key === "Backspace") {
      e.target.value =
        Number(value.slice(0, e.target.value.length - 1)) > 0
          ? Number(value.slice(0, e.target.value.length - 1))
          : ""
    }
  })
}

export function floatInput(element) {
  element.addEventListener("keydown", e => {
    e.preventDefault()
    let value = "" + Number(e.target.value)

    if (e.key >= "0" && e.key <= "9") {
      e.target.value
    } else if (e.key === "ArrowUp") {
      let current = Number(value)
      current++
      e.target.value = current
    } else if (e.key === "ArrowDown") {
      let current = Number(value)
      current--
      e.target.value = current
    }
  })
}
