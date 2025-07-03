import {enterToNextInput, focus, delayFocus} from "./utils/utils.js"
import {showMessege} from "./utils/messege.js"
import {getAllData, updateInto} from "./utils/database.js"


enterToNextInput([username, password, loginButton])
focus(username)

togglePassword.addEventListener("input", e => {
  if(e.target.checked) password.type = "text"
  else password.type = "password"
})

loginButton.addEventListener("click", () => {
  let uname = username.value.trim()
  let pass = password.value.trim()
  let users = getAllData("Users")

  users.forEach(user => {
    if(user.name === uname && user.password === pass) {
      updateInto(
        "Users",
        ["last_login"],
        [new Date().getTime()],
        `WHERE id = ${user.id}`
      )

      const {ipcRenderer} = require("electron")
      if(user.role === "admin") ipcRenderer.send("open:adminWindow")
      else ipcRenderer.send("open:posWindow")

      window.close();
    }
  })

  showMessege("Error", "Username or password does not matched.")
  delayFocus(username)
})