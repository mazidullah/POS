import { updateInto, getAllData } from "./utils/database.js"
import { enterToNextInput, delayFocus } from "./utils/utils.js"
import { showMessege, closeMessege } from "./utils/messege.js"

enterToNextInput([username, password, loginButton])

togglePassword.addEventListener("input", e => {
  if (e.target.checked) {
    password.type = "text"
  } else password.type = "password"
})

loginButton.addEventListener("click", () => {
  let users = getAllData("Users")
  let name = username.value.trim()
  let pass = password.value.trim()

  users.forEach(user => {
    if (user.name === name && user.password === pass) {
      updateInto("Users", ["last_login"], [Date.now()], `where id = ${user.id}`)
      closeMessege()

      let { ipcRenderer } = require("electron")
      ipcRenderer.send("open:posWindow", { id: user.id })
      window.close()
    }
  })

  showMessege("Invalid credential", "Check your username & password")
  delayFocus(username)
})

delayFocus(username)
