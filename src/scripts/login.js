import { hasData, updateInto, getAllData } from "./utils/database.js"
import { enterToNextInput, focus } from "./utils/utils.js"
import { showMessege, closeMessege } from "./utils/messege.js"

enterToNextInput([username, password, loginBtn])

function showMessegeAndFocus() {
  showMessege("Invalid credential", "Check your username & password")
  focus(username)
}

loginBtn.addEventListener("click", () => {
  if (hasData("Users", "name", username.value.trim())) {
    if (hasData("Users", "password", password.value.trim())) {
      window.__pos = {}
      window.__pos.username = username.value.trim()

      let data = getAllData("Users", `where name = ${username.value.trim()}`)
      updateInto(
        "Users",
        ["last_login"],
        [Date.now()],
        `where id = ${data[0].id}`
      )
      closeMessege()
      // enable modules

      login.classList.add("hidden")
      modules.classList.remove("hidden")
    } else showMessegeAndFocus()
  } else showMessegeAndFocus()
})
