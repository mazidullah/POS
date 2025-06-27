import inputToNumberInput from "./inputToNumberInput.js"
import enterToNextInput from "./enterToNextInput.js"

storeName.focus()
inputToNumberInput(storeMobile)
storeMobile.selectionStart = storeMobile.value.length
enterToNextInput([storeName, storeAddress, storeMobile, next])
enterToNextInput([adminName, adminPassword, adminPasswordRepeat, create])



next.addEventListener("click", e => {
  if(storeName.value.length > 0 && storeAddress.value.length > 0 && storeMobile.value.length === 11) {
    messegeStore.classList.add("hidden")
    storeInfo.classList.add("hidden")
    createAdmin.classList.remove("hidden")
    adminName.focus()
  } else {
    messegeStore.classList.remove("hidden")
    messegeStore.innerText = "Fill the inputs"
  }
})

back.addEventListener("click", () => {
  messegeAdmin.classList.add("hidden")
  storeInfo.classList.remove("hidden")
  createAdmin.classList.add("hidden")

  storeName.focus()
})

togglePassword.addEventListener("input", e => {
  if(e.target.checked) {
    adminPassword.type = "text"
    adminPasswordRepeat.type = "text"
  } else {
    adminPassword.type = "password"
    adminPasswordRepeat.type = "password"
  }
})

create.addEventListener("click", e => {
  if(adminName.value.length > 0 && adminPassword.value.length > 0 && adminPassword.value === adminPasswordRepeat.value) {
    const {DatabaseSync} = require("node:sqlite")
    const db = new DatabaseSync("database.db");

    db.prepare("insert into StoreInfo(id, name, mobile, address, cash) values(?, ?, ?, ?, ?)").run(1, storeName.value.trim(), storeMobile.value.trim(), storeAddress.value.trim(), 0)

    db.prepare("insert into Users(id, name, password, role, last_login) values(?, ?, ?, ?, ?)").run(1, adminName.value.trim(), adminPassword.value.trim(), "admin", 0)

    db.close()

    const { ipcRenderer } = require("electron")
    ipcRenderer.send("open:login")
    window.close()
  }
  else if(adminName.value.length === 0) {
    messegeAdmin.classList.remove("hidden")
    messegeAdmin.innerText = "Name is required"
  }
  else {
     messegeAdmin.classList.remove("hidden")
     messegeAdmin.innerText = "Password is not matched"
  }
})
