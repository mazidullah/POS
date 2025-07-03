let nextTimeoutID = -1

function closeMessege() {
  clearTimeout(nextTimeoutID)
  messege.classList.remove("open")
}

export function getSure(messege = "Are you sure?") {
  let h1 = confirmation.querySelector("h1")
  let ok = confirmation.querySelector("button:first-child")
  let cancel = confirmation.querySelector("button:last-child")

  h1.innerText = messege
  confirmation.showModal()
  
  return new Promise((res, rej) => {
    ok.addEventListener("click", () => {confirmation.close(); res()})
    cancel.addEventListener("click", () => {confirmation.close(); rej()})
  })
}

export function showMessege(mheader, mtext) {
  const isOpen = messege.classList.contains("open")

  if (isOpen) closeMessege()
  
  messegeHeader.innerText = mheader
  messegeText.innerText = mtext
  messege.classList.add("open")

  nextTimeoutID = setTimeout(closeMessege, 4000)
}

messegeClose.addEventListener("click", closeMessege)