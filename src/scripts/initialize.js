import { showMessege } from "./utils/messege.js"
import { insertInto } from "./utils/database.js"
import { focus } from "./utils/utils.js"
import { delayFocus } from "./utils/utils.js"
import { mobileInput } from "./utils/utils.js"
import { enterToNextInput } from "./utils/utils.js"
import { focusToSelectAll } from "./utils/utils.js"

focus(storeName)
mobileInput(storeMobile)
enterToNextInput([storeName, storeAddress, storeMobile, next])
enterToNextInput([adminName, adminPassword, adminPasswordRepeat, create])
focusToSelectAll([
  storeName,
  storeAddress,
  storeMobile,
  adminName,
  adminPassword,
  adminPasswordRepeat,
])

back.addEventListener("click", () => {
  storeInfo.classList.remove("hidden")
  adminInfo.classList.add("hidden")
  focus(storeName)
})

togglePassword.addEventListener("input", e => {
  if (e.target.checked) {
    adminPassword.type = "text"
    adminPasswordRepeat.type = "text"
    return
  }
  adminPassword.type = "password"
  adminPasswordRepeat.type = "password"
})

next.addEventListener("click", () => {
  if (!storeName.value.length) {
    showMessege("Invalid input", "Store name is required!")
    delayFocus(storeName)
    return
  }
  if (!storeAddress.value.length) {
    showMessege("Invalid input", "Address is required!")
    delayFocus(storeAddress)
    return
  }
  if (storeMobile.value.length !== 12) {
    showMessege("Invalid input", "Mobile number is not valid")
    delayFocus(storeMobile)
    return
  }

  storeInfo.classList.add("hidden")
  adminInfo.classList.remove("hidden")
  delayFocus(adminName)
})

create.addEventListener("click", () => {
  if (!adminName.value.length) {
    showMessege("Invalid input", "You Must provide a name")
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
    ["id", "name", "password", "role", "last_login"],
    [1, adminName.value.trim(), adminPassword.value.trim(), "admin", 0]
  )

  const { ipcRenderer } = require("electron")
  ipcRenderer.send("open:loginWindow")
  window.close()
})
