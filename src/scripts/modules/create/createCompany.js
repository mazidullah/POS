import { enterToNextInput, mobileInput, delayFocus } from "../../utils/utils.js"
import { showMessege } from "../../utils/messege.js"
import { insertInto, nextRowId } from "../../utils/database.js"
import { render } from "../list/companyList.js"

const tableName = "Companies"
const fieldNames = [
  "name",
  "mobile",
  "remark",
  "dues",
  "order_day",
  "delivery_day",
]
const createCompanyBtns = document.querySelectorAll(`.createCompany`)

mobileInput(createCompanyMobile)
enterToNextInput([
  createCompanyName,
  createCompanyMobile,
  createCompanyRemark,
  createCompanyCreate,
])

function getOrderDays() {
  let orderDay = []
  createCompanyOrderDaySaturday.checked ? orderDay.push("Sat") : ""
  createCompanyOrderDaySunday.checked ? orderDay.push("Sun") : ""
  createCompanyOrderDayMonday.checked ? orderDay.push("Mon") : ""
  createCompanyOrderDayTuesday.checked ? orderDay.push("Tues") : ""
  createCompanyOrderDayWednesday.checked ? orderDay.push("Wed") : ""
  createCompanyOrderDayThusday.checked ? orderDay.push("Thus") : ""
  createCompanyOrderDayFriday.checked ? orderDay.push("Fri") : ""

  return orderDay.join()
}

function getDeliveryDays() {
  let deliveryDay = []
  createCompanyDeliveryDaySaturday.checked ? deliveryDay.push("Sat") : ""
  createCompanyDeliveryDaySunday.checked ? deliveryDay.push("Sun") : ""
  createCompanyDeliveryDayMonday.checked ? deliveryDay.push("Mon") : ""
  createCompanyDeliveryDayTuesday.checked ? deliveryDay.push("Tues") : ""
  createCompanyDeliveryDayWednesday.checked ? deliveryDay.push("Wed") : ""
  createCompanyDeliveryDayThusday.checked ? deliveryDay.push("Thus") : ""
  createCompanyDeliveryDayFriday.checked ? deliveryDay.push("Fri") : ""

  return deliveryDay.join()
}

function resetCheckBox() {
  createCompanyOrderDaySaturday.checked = false
  createCompanyOrderDaySunday.checked = false
  createCompanyOrderDayMonday.checked = false
  createCompanyOrderDayTuesday.checked = false
  createCompanyOrderDayWednesday.checked = false
  createCompanyOrderDayThusday.checked = false
  createCompanyOrderDayFriday.checked = false
  createCompanyDeliveryDaySaturday.checked = false
  createCompanyDeliveryDaySunday.checked = false
  createCompanyDeliveryDayMonday.checked = false
  createCompanyDeliveryDayTuesday.checked = false
  createCompanyDeliveryDayWednesday.checked = false
  createCompanyDeliveryDayThusday.checked = false
  createCompanyDeliveryDayFriday.checked = false
}

createCompanyClose.addEventListener("click", () => {
  createCompany.classList.add("hidden")
})

createCompanyClear.addEventListener("click", () => {
  createCompanyName.value = ""
  createCompanyMobile.value = ""
  createCompanyRemark.value = ""

  createCompanyOrderDaySaturday.checked = false
  createCompanyOrderDaySunday.checked = false
  createCompanyOrderDayMonday.checked = false
  createCompanyOrderDayTuesday.checked = false
  createCompanyOrderDayWednesday.checked = false
  createCompanyOrderDayThusday.checked = false
  createCompanyOrderDayFriday.checked = false

  createCompanyDeliveryDaySaturday.checked = false
  createCompanyDeliveryDaySunday.checked = false
  createCompanyDeliveryDayMonday.checked = false
  createCompanyDeliveryDayTuesday.checked = false
  createCompanyDeliveryDayWednesday.checked = false
  createCompanyDeliveryDayThusday.checked = false
  createCompanyDeliveryDayFriday.checked = false

  delayFocus(createCompanyName)
})

createCompanyCreate.addEventListener("click", () => {
  const name = createCompanyName.value.trim()
  const mobile = createCompanyMobile.value.trim()
  const remark = createCompanyRemark.value.trim()
  const orderDays = getOrderDays()
  const deliveryDays = getDeliveryDays()

  if (name.length === 0) {
    showMessege("Invalid name", "Name must not empty!")
    delayFocus(createCompanyName)
    return
  }

  if (mobile.length < 11) {
    showMessege("Invalid mobile", "Invalid mobile number!")
    delayFocus(createCompanyMobile)
    return
  }

  insertInto(tableName, fieldNames, [
    name,
    mobile,
    remark,
    "0",
    orderDays,
    deliveryDays,
  ])

  showMessege("Successfully Created", `Name: ${createCompanyName.value}`)

  createCompanyName.value = ""
  createCompanyMobile.value = ""
  createCompanyRemark.value = ""

  resetCheckBox()

  render()
  delayFocus(createCompanyName)
  createCompanyId.value = nextRowId(tableName)
})

createCompanyBtns.forEach(navbar => {
  navbar.addEventListener("click", () => {
    createCompany.classList.remove("hidden")
    createCompanyId.value = nextRowId(tableName)
    delayFocus(createCompanyName)
  })
})
