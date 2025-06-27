import enterKeyToNextInput from "./enterToNextInput.js"

username.focus()

enterKeyToNextInput([username, password, loginButton])

togglePassword.addEventListener("input", e => {
  if(e.target.checked) password.type = "text"
  else password.type = "password"
})

loginButton.addEventListener("click", () => {
  let uname = username.value.trim()
  let pass = password.value.trim()

  const {DatabaseSync} = require("node:sqlite")
  const db = new DatabaseSync("database.db")

  let users = db.prepare("select * from Users").all()

  users.forEach(user => {
    if(user.name === uname && user.password === pass) {
      db.prepare(`update Users set last_login = ? where id = ${user.id}`).run(
        new Date().getTime()
      )
      db.close()

      const {ipcRenderer} = require("electron")
      if(user.role === "admin") ipcRenderer.send("open:adminWindow")
      else ipcRenderer.send("open:window")

      window.close();
    }
  })

})