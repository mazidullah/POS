import { enterToNextInput, delayFocus } from "../utils/utils.js"
import { showMessege } from "../utils/messege.js"
import { insertInto, nextRowId, hasData } from "../utils/database.js"
import { render } from "../list/genericList.js"

const tableName = "Generics"
const fieldNames = ["name"]
const navbars = document.querySelectorAll(`.createGeneric`)

enterToNextInput([createGenericName, createGenericCreate])

createGenericClose.addEventListener("click", () => {
  createGenericName.value = ""
  createGeneric.classList.add("hidden")
})

createGenericClear.addEventListener("click", () => {
  createGenericName.value = ""
  delayFocus(createGenericName)
})

createGenericCreate.addEventListener("click", () => {
  const name = createGenericName.value.trim()

  if (name.length === 0) {
    showMessege("Invalid name", "Name must not empty!")
    delayFocus(createGenericName)
    return
  }

  if (hasData(tableName, "name", name)) {
    showMessege("Invalid name", "Name already present")
    delayFocus(createGenericName)
    return
  }

  insertInto(tableName, fieldNames, [name])
  showMessege("Successfully Created", `Name: ${createGenericName.value}`)

  createGenericName.value = ""

  render()
  delayFocus(createGenericName)
  createGenericId.value = nextRowId(tableName)
})

navbars.forEach(navbar => {
  navbar.addEventListener("click", () => {
    createGeneric.classList.remove("hidden")
    createGenericId.value = nextRowId(tableName)
    delayFocus(createGenericName)
  })
})
