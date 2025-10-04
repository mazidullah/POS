import { showMessege } from "./utils/messege.js"
import { insertInto } from "./utils/database.js"
import {
  focus,
  delayFocus,
  mobileInput,
  enterToNextInput,
  focusToSelectAll,
} from "./utils/utils.js"

focus(storeName)
mobileInput(storeMobile)
enterToNextInput([
  storeName,
  storeAddress,
  storeMobile,
  adminName,
  adminPassword,
  adminPasswordRepeat,
  create,
])

focusToSelectAll([
  storeName,
  storeAddress,
  storeMobile,
  adminName,
  adminPassword,
  adminPasswordRepeat,
])

togglePassword.addEventListener("input", e => {
  if (e.target.checked) {
    adminPassword.type = "text"
    adminPasswordRepeat.type = "text"
    return
  }
  adminPassword.type = "password"
  adminPasswordRepeat.type = "password"
})

create.addEventListener("click", () => {
  if (!storeName.value.length) {
    showMessege("Invalid input", "You Must provide a store name")
    delayFocus(storeName)
    return
  }

  if (!storeAddress.value.length) {
    showMessege("Invalid input", "You Must provide a store address")
    delayFocus(storeAddress)
    return
  }

  if (!storeMobile.value.length) {
    showMessege("Invalid input", "You Must provide a store mobile no.")
    delayFocus(storeMobile)
    return
  }

  if (!adminName.value.length) {
    showMessege("Invalid input", "You Must provide a admin name")
    delayFocus(adminName)
    return
  }

  if (!adminPassword.value.length) {
    showMessege("Invalid input", "Give your admin password")
    delayFocus(adminPassword)
    return
  }

  if (adminPassword.value !== adminPasswordRepeat.value) {
    showMessege("Error", "Password does not match")
    delayFocus(adminPasswordRepeat)
    return
  }

  insertInto(
    "StoreInfo",
    ["id", "name", "mobile", "address", "cash"],
    [
      1,
      storeName.value.trim(),
      storeMobile.value.trim(),
      storeAddress.value.trim(),
      0,
    ]
  )

  insertInto(
    "Users",
    ["id", "name", "password", "role", "access_modules", "last_login"],
    [1, adminName.value.trim(), adminPassword.value.trim(), "admin", "", 0]
  )

  const { ipcRenderer } = require("electron")
  ipcRenderer.send("open:loginWindow")
  window.close()
})
