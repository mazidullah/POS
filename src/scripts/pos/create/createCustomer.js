import { enterToNextInput, mobileInput, delayFocus } from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { insertInto, nextRowId } from "../../utils/database.js"

const navbarName = "createCustomer"
const tableName = "Customers"
const fieldNames = ["name", "address", "mobile", "dues", "remark"]
const navbar = document.querySelector(`li[data-navitem="${navbarName}"]`)

enterToNextInput([
  newCustomerName,
  newCustomerAddress,
  newCustomerMobile,
  createNewCustomer,
])
mobileInput(newCustomerMobile)

navbar.addEventListener("click", () => {
  newCustomerId.value = nextRowId(tableName)
  delayFocus(newCustomerName)
})

newCustomerRemark.addEventListener("keyup", e => {
  if (e.target.value !== "" && e.key === "Enter") createNewCustomer.focus()
})
createNewCustomer.addEventListener("click", () => {
  const name = newCustomerName.value.trim()
  const address = newCustomerAddress.value.trim()
  const mobile = newCustomerMobile.value.trim()
  const dues = "0.0"
  const remark = newCustomerRemark.value.trim()

  if (name.length === 0) {
    showMessege("Invalid name", "Customer name must not empty!")
    delayFocus(newCustomerName)
    return
  }
  if (mobile.length < 11) {
    showMessege(
      "Invalid mobile no.",
      "Enter a valid mobile number (01xxx-xxxxxx"
    )
    delayFocus(newCustomerMobile)
    return
  }

  insertInto(tableName, fieldNames, [name, address, mobile, dues, remark])
  showMessege("Successfully Created", `Username: ${newCustomerName.value}`)

  newCustomerName.value = ""
  newCustomerAddress.value = ""
  newCustomerMobile.value = ""
  newCustomerRemark.value = ""

  delayFocus(newCustomerName)
  newCustomerId.value = nextRowId(tableName)
})
