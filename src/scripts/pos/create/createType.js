import { enterToNextInput, delayFocus } from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { insertInto, nextRowId } from "../../utils/database.js"

const navbarName = "createType"
const tableName = "Types"
const fieldNames = ["name"]
const navbar = document.querySelector(`li[data-navitem="${navbarName}"]`)

enterToNextInput([newTypeName, createNewType])

navbar.addEventListener("click", () => {
  newTypeId.value = nextRowId(tableName)
  delayFocus(newTypeName)
})

createNewType.addEventListener("click", () => {
  const name = newTypeName.value.trim()

  if (name.length === 0) {
    showMessege("Invalid name", "Name must not empty!")
    delayFocus(newTypeName)
    return
  }

  insertInto(tableName, fieldNames, [name])
  showMessege("Successfully Created", `Name: ${newTypeName.value}`)

  newTypeName.value = ""

  delayFocus(newTypeName)
  newTypeId.value = nextRowId(tableName)
})
