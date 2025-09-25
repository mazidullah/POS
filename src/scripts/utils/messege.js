let nextTimeoutID = -1
let close = messege.querySelector(".close-btn")

export function closeMessege() {
  clearTimeout(nextTimeoutID)
  messege.classList.remove("open")
}

export function getSure(messege = "Are you sure?") {
  let header = confirmation.querySelector(".header")
  let ok = confirmation.querySelector(".ok")
  let cancel = confirmation.querySelector(".cancel")

  header.innerText = messege
  confirmation.classList.add("open")

  return new Promise((res, rej) => {
    ok.addEventListener("click", () => {
      confirmation.classList.remove("open")
      res()
    })

    cancel.addEventListener("click", () => {
      confirmation.classList.remove("open")
      rej()
    })
  })
}

export function showMessege(mheader, mtext) {
  const isOpen = messege.classList.contains("open")
  if (isOpen) closeMessege()

  let header = messege.querySelector(".header")
  let text = messege.querySelector(".text")

  header.innerText = mheader
  text.innerText = mtext
  messege.classList.add("open")
  nextTimeoutID = setTimeout(closeMessege, 15000)
}

close.addEventListener("click", closeMessege)
