import {getDateTime} from "../utils/dateTime.js"
import {getSure, showMessege} from "../utils/messege.js"
import {delayFocus, enterToNextInput, focus} from "../utils/utils.js"
import {getData, getAllData, insertInto, updateInto, deleteFrom} from "../utils/database.js"

enterToNextInput([newUserName, newUserPassword, createNewUser])

const state = {
  allUsers: {},
  currentUserId: -1,
}
const tbody = document.querySelector("#users tbody")
const navbar = document.querySelector("nav ul > li[data-navitem='users']")


const checkUser = (username) => {
  state.allUsers = getAllData("Users")
  let hasUser = false

  state.allUsers.forEach(user => {
    if (user.name === username) {
      hasUser = true
    }
  })

  return hasUser
}

const sameUser = () => {
  const userDetails = getData("Users", `where id = ${state.currentUserId}`)
  return userEditName.value.trim() === userDetails.name
}

const handleUserEdit = (e) => {
  state.currentUserId = Number(e.target.closest("tr").dataset.userid)
  const userDetails = getData("Users", `where id = ${state.currentUserId}`)

  userEdit.showModal()

  userEditName.value = userDetails.name
  userEditPassword.value = userDetails.password
  focus(userEditName)

  enterToNextInput([userEditName, userEditPassword, userEditOk])
}

const handleUserDelete = (e) => {
  state.currentUserId = Number(e.target.closest("tr").dataset.userid)
  getSure().then(() => {
    showMessege("Successfully deleted", `name: ${getData("Users", "WHERE id = " + state.currentUserId).name}`)
    deleteFrom("Users", `WHERE id = ${state.currentUserId}`)
    renderUser()
    focus(newUserName)
  })
}

const displayAllUserToTable = () => {
  let htmlText = ""
  tbody.innerHTML = ""
  state.allUsers = getAllData("Users")

  state.allUsers.forEach((u, i) => {
    let idx = i + 1 < 10 ? "0" + (i + 1) : i
    let role = u.role === "admin" ? u.name + " (admin)" : u.name
    let last_login = getDateTime(new Date(u.last_login))
    let deleteBtn =
      u.role === "admin"
        ? ""
        : `
        <div class="userDeleteBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 -960 960 960" fill="gray">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </div>
      `

    htmlText += `
      <tr data-userid=${u.id}>
        <td>${idx}</td>
        <td>${role}</td>
        <td>********</td>
        <td>${last_login}</td>
        <td>
          <div>
            <div class="userEditBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 -960 960 960"  fill="gray">
                <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/>
              </svg>
            </div>
            ${deleteBtn}
          </div>
        </td>
      </tr>
    `
  })

  tbody.innerHTML = htmlText
}

const renderUser = () => {
  displayAllUserToTable()
}

tbody.addEventListener(
  "click",
  e => {
    if (e.target.closest("div.userEditBtn")) handleUserEdit(e)
    else if (e.target.closest("div.userDeleteBtn")) handleUserDelete(e)
  },
  true
)

createNewUser.addEventListener("click", () => {
  if (newUserName.value.length > 0 && newUserPassword.value.length > 0) {
    if (!checkUser(newUserName.value.trim())) {
      insertInto(
        "Users",
        ["name", "password", "role", "last_login"],
        [
          newUserName.value.trim(),
          newUserPassword.value.trim(),
          "user",
          new Date().getTime(),
        ]
      )
      showMessege("Successfully Created", `Username: ${newUserName.value}`)
      newUserName.value = ""
      newUserPassword.value = ""
      renderUser()
      focus(newUserName)
    } 
    else {
      showMessege("Error", "Username name is already present!")
      delayFocus(newUserName)
    }
  } 
  
  else if(newUserName.value.length === 0) {
    showMessege("Invalid username", "You must provide an username.")
    delayFocus(newUserName)
  }

  else {
    showMessege("Invalid password", "You must provide a password.")
    delayFocus(newUserPassword)
  }
})

userEditOk.addEventListener("click", () => {
  if (userEditName.value.length > 0 && userEditPassword.value.length > 0) {
    if (!checkUser(userEditName.value.trim()) || sameUser()) {
      updateInto(
        "Users",
        ["name", "password"],
        [userEditName.value.trim(), userEditPassword.value.trim()],
        `WHERE id = ${state.currentUserId}`
      )

      showMessege("Succssfully updated", `Username: ${userEditName.value}, Password: ${userEditPassword.value}`)
      renderUser()
      userEdit.close()
      focus(newUserName)
    } 
    else {
      showMessege("Error", "Username name is already present!")
      delayFocus(userEditName)
    }
  } else if(userEditName.value.length === 0) {
    showMessege("Invalid input", "Pls. Enter a name")
    delayFocus(userEditName)
  } else {
    showMessege("Invalid input", "Password is required!")
    delayFocus(userEditPassword)
  }
})

userEditClose.addEventListener("click", () => {
  userEdit.close()
  focus(newUserName)
})

navbar.addEventListener("click", renderUser())

