import { enterToNextInput, mobileInput ,delayFocus } from "../utils/utils.js"
import { showMessege } from "../utils/messege.js"
import { insertInto, nextRowId } from "../utils/database.js"

const navbarName = "createCompany"
const tableName = "Companies"
const fieldNames = ["name", "mobile", "remark", "dues", "order_day", "delivery_day"]
const navbar = document.querySelector(`li[data-navitem="${navbarName}"]`)

enterToNextInput([newCompanyName, newCompanyMobile, newCompanyRemark, createNewCompany])
mobileInput(newCompanyMobile)

function getOrderDays() {
  let orderDay = []
  newCompanyOrderDaySaturday.checked ? orderDay.push(6) : ""
  newCompanyOrderDaySunday.checked ? orderDay.push(0) : ""
  newCompanyOrderDayMonday.checked ? orderDay.push(1) : ""
  newCompanyOrderDayTuesday.checked ? orderDay.push(2) : ""
  newCompanyOrderDayWednesday.checked ? orderDay.push(3) : ""
  newCompanyOrderDayThusday.checked ? orderDay.push(4) : ""
  newCompanyOrderDayFriday.checked ? orderDay.push(5) : ""

  return orderDay.join()
}

function getDeliveryDays() {
  let deliveryDay = []
  newCompanyDeliveryDaySaturday.checked ? deliveryDay.push(6) : ""
  newCompanyDeliveryDaySunday.checked ? deliveryDay.push(0) : ""
  newCompanyDeliveryDayMonday.checked ? deliveryDay.push(1) : ""
  newCompanyDeliveryDayTuesday.checked ? deliveryDay.push(2) : ""
  newCompanyDeliveryDayWednesday.checked ? deliveryDay.push(3) : ""
  newCompanyDeliveryDayThusday.checked ? deliveryDay.push(4) : ""
  newCompanyDeliveryDayFriday.checked ? deliveryDay.push(5) : ""

  return deliveryDay.join()
}

function resetCheckBox() {
  newCompanyOrderDaySaturday.checked  = false
  newCompanyOrderDaySunday.checked  = false
  newCompanyOrderDayMonday.checked  = false
  newCompanyOrderDayTuesday.checked  = false
  newCompanyOrderDayWednesday.checked  = false
  newCompanyOrderDayThusday.checked  = false
  newCompanyOrderDayFriday.checked  = false

  newCompanyDeliveryDaySaturday.checked = false
  newCompanyDeliveryDaySunday.checked = false
  newCompanyDeliveryDayMonday.checked = false
  newCompanyDeliveryDayTuesday.checked = false
  newCompanyDeliveryDayWednesday.checked = false
  newCompanyDeliveryDayThusday.checked = false
  newCompanyDeliveryDayFriday.checked = false
}

navbar.addEventListener("click", () => {
  newCompanyId.value = nextRowId(tableName)
  delayFocus(newCompanyName)
})

createNewCompany.addEventListener("click", () => {
  const name = newCompanyName.value.trim()
  const mobile = newCompanyMobile.value.trim()
  const remark = newCompanyRemark.value.trim()
  const orderDays = getOrderDays()
  const deliveryDays = getDeliveryDays()


  if (name.length === 0) {
    showMessege("Invalid name", "Name must not empty!")
    delayFocus(newCompanyName)
    return
  }

  if (mobile.length < 11) {
    showMessege("Invalid mobile", "Invalid mobile number!")
    delayFocus(newCompanyMobile)
    return
  }

  insertInto(tableName, fieldNames, [name, mobile, remark, "0.0", orderDays, deliveryDays])
  showMessege("Successfully Created", `Name: ${newCompanyName.value}`)

  newCompanyName.value = ""
  newCompanyMobile.value = ""
  newCompanyRemark.value = ""

  resetCheckBox()

  delayFocus(newCompanyName)
  newCompanyId.value = nextRowId(tableName)
})