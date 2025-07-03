import { enterToNextInput, delayFocus } from "../utils/utils.js"
import {showMessege} from "../utils/messege.js"
import { insertInto, nextRowId } from "../utils/database.js"

const navbarName = "createGeneric"
const tableName = "Generics"
const fieldNames = ["name"]
const navbar = document.querySelector(`li[data-navitem="${navbarName}"]`)

enterToNextInput([newGenericName, createNewGeneric])

navbar.addEventListener("click", () => {
  newGenericId.value = nextRowId(tableName)
  delayFocus(newGenericName)
})

createNewGeneric.addEventListener("click", () => {
  const name = newGenericName.value.trim()

  if(name.length === 0) {
    showMessege("Invalid name", "Name must not empty!")
    delayFocus(newGenericName)
    return
  }

  insertInto(tableName, fieldNames, [name])
  showMessege("Successfully Created", `Name: ${newGenericName.value}`)

  newGenericName.value = ""

  delayFocus(newGenericName)
  newGenericId.value = nextRowId(tableName)
})