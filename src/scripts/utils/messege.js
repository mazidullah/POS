let nextTimeoutID = -1
let close = messege.querySelector('.close')

function closeMessege() {
  clearTimeout(nextTimeoutID)
  messege.classList.remove('open')
  messege.close()
}

export function getSure(messege = 'Are you sure?') {
  let header = confirmation.querySelector('.header')
  let ok = confirmation.querySelector('.ok')
  let cancel = confirmation.querySelector('.cancel')

  header.innerText = messege
  confirmation.showModal()

  return new Promise((res, rej) => {
    ok.addEventListener('click', () => {
      confirmation.close()
      res()
    })

    cancel.addEventListener('click', () => {
      confirmation.close()
      rej()
    })
  })
}

export function showMessege(mheader, mtext) {
  const isOpen = messege.classList.contains('open')
  if (isOpen) closeMessege()

  let header = messege.querySelector('.header')
  let text = messege.querySelector('.text')

  header.innerText = mheader
  text.innerText = mtext
  messege.classList.add('open')
  messege.show()

  nextTimeoutID = setTimeout(closeMessege, 4000)
}

close.addEventListener('click', closeMessege)
