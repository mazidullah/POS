import navigator from "./navigator.js";
import enterToNextInput from "./enterToNextInput.js"

const state = {
  hasMessege: false
}

messege.querySelector("svg").addEventListener("click", () => {
  messege.classList.add("hidden")
})

function renderAdminUsermanagement() {
  newUserName.value = ""
  newUserPassword.value = ""

  setTimeout(() => {
    newUserName.focus()
  }, 0);

  const tbody = document.querySelector("div[data-navbar='user-management'] tbody")
  tbody.innerHTML = ""
  
  const {DatabaseSync} = require("node:sqlite")
  const db = new DatabaseSync("database.db")
  const allUsers = db.prepare("select * from Users").all()
  
  allUsers.forEach(user => {
    let lastLogin = new Date(user.last_login)
    let lastLoginDate = lastLogin.getDate() < 10? "0" + lastLogin.getDate(): lastLogin.getDate()
    let lastLoginMonth = lastLogin.getMonth() + 1 < 10? "0" + (lastLogin.getMonth() + 1): lastLogin.getMonth() + 1
    let lastLoginYear = lastLogin.getFullYear()
    let lastLoginHour =
    lastLogin.getHours() < 10 ? "0" + lastLogin.getHours() : lastLogin.getHours()
    let lastLoginMinutes =
    lastLogin.getMinutes() < 10
    ? "0" + lastLogin.getMinutes()
    : lastLogin.getMinutes()
    
    let displayDate = `${lastLoginHour}:${lastLoginMinutes} on ${lastLoginDate}/${lastLoginMonth}/${lastLoginYear}`;
    const tr = document.createElement("tr")
    tr.dataset["userId"] = user.id
    tr.innerHTML = `
    <td>${user.id < 10? '0' + user.id: user.id}</td>
    <td>${user.role === "admin"? user.name + " (admin)": user.name}</td>
    <td>********</td>
    <td>${displayDate}</td>
    <td><button class="userEditBtn">Edit</button>${user.role === "admin"? "": "<button class='userDeleteBtn'>Delete</button>"}</td>
    `;
    
    tbody.append(tr)

    let editBtn = document.querySelectorAll(".userEditBtn")
    let deleteBtn = document.querySelectorAll(".userDeleteBtn")

    
    editBtn.forEach(ed => {
      let id = ed.closest("tr").dataset.userId
      let currentUser = db.prepare("select * from Users where id=?").get(id)

      ed.addEventListener("click", ev => {
        userEdit.showModal()

        let userEditOk = userEdit.querySelector("#userEditOk")
        let userEditName = userEdit.querySelector("#userEditName")
        let userEditPassword = userEdit.querySelector("#userEditPassword")

        userEditName.value = user.name
        userEditPassword.value = user.password


        userEditOk.addEventListener("click", () => {
          if (
            userEditName.value.length > 0 &&
            userEditPassword.value.length > 0
          ) {
            const allUser = db.prepare("select * from Users").all()
            let hasUser = false

            allUser.forEach(user => {
              if (user.name === userEditName.value && user.id !== id) {
                messege.querySelector("h1").innerHTML = "Error"
                messege.querySelector("p").innerHTML =
                  "It's seem We have another User with same name"

                messege.classList.remove("hidden")

                if (!state.hasMessege) {
                  state.hasMessege = true
                  setTimeout(() => {
                    state.hasMessege = false
                    messege.classList.add("hidden")
                  }, 3500)
                }

                hasUser = true
              }
            })

            if (!hasUser) {
              db.prepare(`update Users set name = ?, password = ?, role = ?`).run(
                userEditName.value.trim(),
                userEditPassword.value.trim(),
                currentUser.role
              )
              userEdit.close()
              renderAdminUsermanagement()
            }

            db.close()
          } else {
            messege.querySelector("h1").innerHTML = "Error"
            messege.querySelector("p").innerHTML =
              "Username and password must not empty"

            messege.classList.remove("hidden")

            if (!state.hasMessege) {
              state.hasMessege = true
              setTimeout(() => {
                state.hasMessege = false
                messege.classList.add("hidden")
              }, 3500)
            }

            db.close()
          }
        })
      })

    })
  })

  db.close()
}

document.querySelector("li[data-navbar='user-management']").addEventListener("click", e => {
  if(e.target.closest("li").classList.contains("active-nav")) return
  renderAdminUsermanagement()
})

createNewUser.addEventListener("click", () => {
  const {DatabaseSync} = require("node:sqlite")
  const db = new DatabaseSync("database.db")
  
  if(newUserName.value.length > 0 && newUserPassword.value.length > 0) {
    const allUser = db.prepare("select * from Users").all()
    let hasUser = false
    
    allUser.forEach(user => {
      if(user.name === newUserName.value.trim()) {
        messege.querySelector("h1").innerHTML = "Error"
        messege.querySelector("p").innerHTML = "It's seem We have another User with same name"
        
        messege.classList.remove("hidden")
        
        if(!state.hasMessege) {
          state.hasMessege = true
          setTimeout(() => {
            state.hasMessege = false
            messege.classList.add("hidden")
          }, 3500)
        }
        
        hasUser = true
      }
    })
    
    if(!hasUser) {
      db.prepare(
        `insert into Users(name, password, role, last_login) values(?, ?, ?, ?)`
      ).run(
        newUserName.value.trim(),
        newUserPassword.value.trim(),
        "user",
        new Date().getTime()
      )
      renderAdminUsermanagement()
    }

    db.close()
  } else {
    messege.querySelector("h1").innerHTML = "Error"
    messege.querySelector("p").innerHTML =
    "Username and password must not empty"
    
    messege.classList.remove("hidden")
    
    if (!state.hasMessege) {
      state.hasMessege = true
      setTimeout(() => {
        state.hasMessege = false
        messege.classList.add("hidden")
      }, 3500)
    }
    
    db.close()
  }
})

enterToNextInput([newUserName, newUserPassword, createNewUser])
navigator(document.querySelector("nav > ul"), document.querySelector("main"), "navbar", "active-nav")