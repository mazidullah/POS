import { enterToNextInput, delayFocus } from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { insertInto, nextRowId } from "../../utils/database.js"
import { render } from "../list/typeList.js"

const tableName = "Types"
const fieldNames = ["name"]
const navbars = document.querySelectorAll(`.createType`)

enterToNextInput([createTypeName, createTypeCreate])

createTypeClose.addEventListener("click", () => {
  createType.close()
})

createTypeCancel.addEventListener("click", () => {
  createType.close()
})

createTypeCreate.addEventListener("click", () => {
  const name = createTypeName.value.trim()

  if (name.length === 0) {
    showMessege("Invalid name", "Name must not empty!")
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
    createType.showModal()
    createTypeId.value = nextRowId(tableName)
    delayFocus(createTypeName)
  })
})
