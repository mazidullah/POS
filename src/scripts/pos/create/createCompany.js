import { enterToNextInput, mobileInput, delayFocus } from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { insertInto, nextRowId } from "../../utils/database.js"

const navbarName = "createCompany"
const tableName = "Companies"
const fieldNames = [
  "name",
  "mobile",
  "remark",
  "dues",
  "order_day",
  "delivery_day",
]
const navbar = document.querySelector(`li[data-navitem="${navbarName}"]`)

enterToNextInput([
  newCompanyName,
  newCompanyMobile,
  newCompanyRemark,
  createNewCompany,
])
mobileInput(newCompanyMobile)

function getOrderDays() {
  let orderDay = []
  newCompanyOrderDaySaturday.checked ? orderDay.push("Sat") : ""
  newCompanyOrderDaySunday.checked ? orderDay.push("Sun") : ""
  newCompanyOrderDayMonday.checked ? orderDay.push("Mon") : ""
  newCompanyOrderDayTuesday.checked ? orderDay.push("Tues") : ""
  newCompanyOrderDayWednesday.checked ? orderDay.push("Wed") : ""
  newCompanyOrderDayThusday.checked ? orderDay.push("Thus") : ""
  newCompanyOrderDayFriday.checked ? orderDay.push("Fri") : ""

  return orderDay.join()
}

function getDeliveryDays() {
  let deliveryDay = []
  newCompanyDeliveryDaySaturday.checked ? deliveryDay.push("Sat") : ""
  newCompanyDeliveryDaySunday.checked ? deliveryDay.push("Sun") : ""
  newCompanyDeliveryDayMonday.checked ? deliveryDay.push("Mon") : ""
  newCompanyDeliveryDayTuesday.checked ? deliveryDay.push("Tues") : ""
  newCompanyDeliveryDayWednesday.checked ? deliveryDay.push("Wed") : ""
  newCompanyDeliveryDayThusday.checked ? deliveryDay.push("Thus") : ""
  newCompanyDeliveryDayFriday.checked ? deliveryDay.push("Fri") : ""

  return deliveryDay.join()
}

function resetCheckBox() {
  newCompanyOrderDaySaturday.checked = false
  newCompanyOrderDaySunday.checked = false
  newCompanyOrderDayMonday.checked = false
  newCompanyOrderDayTuesday.checked = false
  newCompanyOrderDayWednesday.checked = false
  newCompanyOrderDayThusday.checked = false
  newCompanyOrderDayFriday.checked = false

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

  insertInto(tableName, fieldNames, [
    name,
    mobile,
    remark,
    "0.0",
    orderDays,
    deliveryDays,
  ])
  showMessege("Successfully Created", `Name: ${newCompanyName.value}`)

  newCompanyName.value = ""
  newCompanyMobile.value = ""
  newCompanyRemark.value = ""

  resetCheckBox()

  delayFocus(newCompanyName)
  newCompanyId.value = nextRowId(tableName)
})
