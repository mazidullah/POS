import { focus } from "./utils/utils.js"
import { delayFocus } from "./utils/utils.js"
import { enterToNextInput } from "./utils/utils.js"
import { focusToSelectAll } from "./utils/utils.js"
import { showMessege } from "./utils/messege.js"
import { getAllData } from "./utils/database.js"
import { updateInto } from "./utils/database.js"

focus(username)
enterToNextInput([username, password, loginButton])
focusToSelectAll([username, password, loginButton])

togglePassword.addEventListener("input", e => {
  if (e.target.checked) password.type = "text"
  else password.type = "password"
})

loginButton.addEventListener("click", () => {
  let uname = username.value.trim()
  let pass = password.value.trim()
  let users = getAllData("Users")

  let haveNotUser = true

  users.forEach(user => {
    if (user.name === uname && user.password === pass) {
      haveNotUser = false
      updateInto(
        "Users",
        ["last_login"],
        [new Date().getTime()],
        `WHERE id = ${user.id}`
      )

      const { ipcRenderer } = require("electron")
      if (user.role === "admin") ipcRenderer.send("open:adminWindow")
      else ipcRenderer.send("open:posWindow")

      window.close()
    }
  })

  if (haveNotUser) {
    showMessege("Could not login", "Username or password does not matched.")
    delayFocus(username)
  }
})
