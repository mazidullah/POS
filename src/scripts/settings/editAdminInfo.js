import { getData, updateInto } from "../utils/database.js"
import { showMessege } from "../utils/messege.js"
import { delayFocus, enterToNextInput } from "../utils/utils.js"

enterToNextInput([
  editAdminInfoOldName,
  editAdminInfoOldPassword,
  editAdminInfoNewName,
  editAdminInfoNewPassword,
  editAdminInfoSave,
])

function clearAdminInfo() {
  editAdminInfoOldName.value = ""
  editAdminInfoNewName.value = ""
  editAdminInfoOldPassword.value = ""
  editAdminInfoNewPassword.value = ""
  editAdminInfoTogglePassword.checked = false
}

openAdminInfo.addEventListener("click", () => {
  editAdminInfo.classList.remove("hidden")
  delayFocus(editAdminInfoOldName)
})

editAdminInfoClose.addEventListener("click", () => {
  clearAdminInfo()
  editAdminInfo.classList.add("hidden")
})

editAdminInfoClear.addEventListener("click", () => {
  clearAdminInfo()
  delayFocus(editAdminInfoOldName)
})

editAdminInfoTogglePassword.addEventListener("input", () => {
  if (editAdminInfoTogglePassword.checked) {
    editAdminInfoOldPassword.type = "text"
    editAdminInfoNewPassword.type = "text"
  } else {
    editAdminInfoOldPassword.type = "password"
    editAdminInfoNewPassword.type = "password"
  }
})

editAdminInfoSave.addEventListener("click", () => {
  let admin = getData("Users", "where id = 1")

  let oldName = editAdminInfoOldName.value.trim()
  let oldPassword = editAdminInfoOldPassword.value.trim()
  let newName = editAdminInfoNewName.value.trim()
  let newPassword = editAdminInfoNewPassword.value.trim()

  if (oldName !== admin.name) {
    showMessege("Invalid Credential", "Check old name & password")
    delayFocus(editAdminInfoOldName)
    return
  }

  if (oldPassword !== admin.password) {
    showMessege("Invalid Credential", "Check old name & password")
    delayFocus(editAdminInfoOldName)
    return
  }

  if (newName.length === 0) {
    showMessege("Invalid name", "Name must not be empty!")
    delayFocus(editAdminInfoNewName)
    return
  }

  if (newPassword.length === 0) {
    showMessege("Invalid password", "Password must not be empty!")
    delayFocus(editAdminInfoNewPassword)
    return
  }

  updateInto(
    "Users",
    ["name", "password"],
    [newName, newPassword],
    "where id = 1"
  )

  showMessege("Succefully updated", `Name: ${newName}, Pass: ${newPassword}`)

  clearAdminInfo()
  editAdminInfo.classList.add("hidden")
})
