import { enterToNextInput, mobileInput, delayFocus } from "../utils/utils.js"
import { showMessege } from "../utils/messege.js"
import { insertInto, nextRowId } from "../utils/database.js"
import { render } from "../list/customerList.js"

const tableName = "Customers"
const fieldNames = ["name", "address", "mobile", "dues", "remark"]
const createCustomerBtns = document.querySelectorAll(`.createCustomer`)

mobileInput(createCustomerMobile)

enterToNextInput([
  createCustomerName,
  createCustomerAddress,
  createCustomerRemark,
  createCustomerMobile,
  createCustomerCreate,
])

createCustomerClose.addEventListener("click", () => {
  createCustomerName.value = ""
  createCustomerAddress.value = ""
  createCustomerMobile.value = ""
  createCustomerRemark.value = ""

  createCustomer.classList.add("hidden")
})

createCustomerClear.addEventListener("click", () => {
  createCustomerName.value = ""
  createCustomerAddress.value = ""
  createCustomerMobile.value = ""
  createCustomerRemark.value = ""

  delayFocus(createCustomerName)
})

createCustomerCreate.addEventListener("click", () => {
  const name = createCustomerName.value.trim()
  const address = createCustomerAddress.value.trim()
  const mobile = createCustomerMobile.value.trim()
  const dues = 0
  const remark = createCustomerRemark.value.trim()

  if (name.length === 0) {
    showMessege("Invalid name", "Customer name must not empty!")
    delayFocus(createCustomerName)
    return
  }
  if (mobile.length < 12) {
    showMessege("Invalid mobile no.", "Enter a valid mobile number")
    delayFocus(createCustomerMobile)
    return
  }

  insertInto(tableName, fieldNames, [name, address, mobile, dues, remark])
  showMessege("Successfully Created", `Username: ${createCustomerName.value}`)

  createCustomerName.value = ""
  createCustomerAddress.value = ""
  createCustomerMobile.value = ""
  createCustomerRemark.value = ""

  render()
  delayFocus(createCustomerName)
  createCustomerId.value = nextRowId(tableName)
})

createCustomerBtns.forEach(navbar => {
  navbar.addEventListener("click", () => {
    createCustomer.classList.remove("hidden")
    createCustomerId.value = nextRowId(tableName)
    delayFocus(createCustomerName)
  })
})
