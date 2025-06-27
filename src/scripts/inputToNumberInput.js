export default function inputToNumberInput(selector) {
  selector.addEventListener("keydown", e => {
    e.preventDefault()

    let value = e.target.value
    let length = value.length
    let selectionStart = e.target.selectionStart
    let selectionEnd = e.target.selectionEnd

    let chunk1 = value.slice(0, selectionStart)
    let chunk2 = value.slice(selectionEnd, length)

    if (e.key >= "0" && e.key <= "9") {
      if (e.target.value.length >= 11) return
      if (e.target.value.length === 0 && e.key !== "0") return
      if (e.target.value.length === 1 && e.key !== "1") return

      e.target.value = chunk1 + e.key + chunk2
      e.target.selectionStart = (chunk1 + e.key).length
      e.target.selectionEnd = (chunk1 + e.key).length
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

    if (e.key === "ArrowLeft") {
      e.target.selectionStart =
        e.target.selectionStart - 1 >= 0 ? e.target.selectionStart - 1 : 0
      e.target.selectionEnd = e.target.selectionStart
    }

    if (e.key === "ArrowRight") {
      e.target.selectionStart =
        e.target.selectionStart + 1 <= e.target.value.length
          ? e.target.selectionStart + 1
          : e.target.value.length
      e.target.selectionEnd = e.target.selectionStart
    } else return
  })
}