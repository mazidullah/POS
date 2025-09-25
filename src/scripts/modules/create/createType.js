import { enterToNextInput, delayFocus } from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { hasData, insertInto, nextRowId } from "../../utils/database.js"
import { render } from "../list/typeList.js"

const tableName = "Types"
const fieldNames = ["name"]
const navbars = document.querySelectorAll(`.createType`)

enterToNextInput([createTypeName, createTypeCreate])

createTypeClose.addEventListener("click", () => {
  createType.classList.add("hidden")
})

createTypeClear.addEventListener("click", () => {
  createTypeName.value = ""
  delayFocus(createTypeName)
})

createTypeCreate.addEventListener("click", () => {
  const name = createTypeName.value.trim()

  if (name.length === 0) {
    showMessege("Invalid name", "Type name must not empty!")
    delayFocus(createTypeName)
    return
  }

  if (hasData("Types", "name", name)) {
    showMessege("Invalid name", "Type has already present")
    delayFocus(createTypeName)
    return
  }

  insertInto(tableName, fieldNames, [name])
  showMessege("Successfully Created", `Name: ${createTypeName.value}`)

  createTypeName.value = ""

  render()
  delayFocus(createTypeName)
  createTypeId.value = nextRowId(tableName)
})

navbars.forEach(navbar => {
  navbar.addEventListener("click", () => {
    createType.classList.remove("hidden")
    createTypeId.value = nextRowId(tableName)
    delayFocus(createTypeName)
  })
})
