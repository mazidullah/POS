import { delayFocus } from "../utils/utils.js"
import { intInput } from "../utils/utils.js"
import { enterToNextInput } from "../utils/utils.js"
import { mobileInput } from "../utils/utils.js"
import { updateInto, nextRowId, getData } from "../utils/database.js"
import { showMessege } from "../utils/messege.js"

function getCompanies(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(name)`)
  else if (sortBy === "name_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(name) DESC`)
  else if (sortBy === "id")
    stmt = db.prepare(`SELECT * from Companies ORDER BY id`)
  else if (sortBy === "id_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY id DESC`)
  else if (sortBy === "mobile")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(mobile)`)
  else if (sortBy === "mobile_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(mobile) DESC`)
  else if (sortBy === "order_day")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(order_day)`)
  else if (sortBy === "order_day_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(order_day) DESC`)
  else if (sortBy === "delivery_day")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(delivery_day)`)
  else if (sortBy === "delivery_day_des")
    stmt = db.prepare(
      `SELECT * from Companies ORDER BY UPPER(delivery_day) DESC`
    )
  else if (sortBy === "remark")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(remark)`)
  else if (sortBy === "remark_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(remark) DESC`)
  else if (sortBy === "due")
    stmt = db.prepare(`SELECT * from Companies ORDER BY dues`)
  else if (sortBy === "due_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY dues DESC`)

  const companies = stmt.all()
  db.close()

  return companies
}

function sanitize(searchTerm, companies) {
  let niddle

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  companies.forEach(company => {
    if (company.id === Number(searchTerm)) {
      exactMatch.add(company)
      return
    }

    if (company.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(company)
      return
    }

    if (niddle.test(company.name)) {
      possibleNameMatch.add(company)
      return
    }
  })

  return [...exactMatch, ...startsWith, ...possibleNameMatch]
}

export function render() {
  let searchTerm = companyListSearch.value.trim()
  let display_per_page = Number(companyListDisplayPerPage.value)
  let sortBy = companyListSortBy.value

  const allSortedData = sanitize(searchTerm, getCompanies(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)

  companyListPossiblePage.innerHTML = possiblePage
  companyListGotoPage.value > possiblePage
    ? (companyListGotoPage.value = possiblePage)
    : ""

  let goto_page = Number(companyListGotoPage.value) || 1
  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ""

  toRenderData.forEach(list => {
    let hasDue = Number(list.dues) > 0

    htmlString += `
        <tr data-id="${list.id}">
          <td>${list.id}</td>
          <td>${list.name}</td>
          <td>${list.mobile}</td>
          <td>${list.order_day}</td>
          <td>${list.delivery_day}</td>
          <td>${list.remark}</td>
          <td ${hasDue ? "style='background-color: #cc0000c0'" : ""}>${
      list.dues
    }</td>
        </tr>
      `
  })

  companyList.querySelector("tbody").innerHTML = ""
  companyList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([companyListSearch, companyListGotoPage, companyListSearch])
enterToNextInput([
  editCompanyListName,
  editCompanyListRemark,
  editCompanyListMobile,
  editCompanyListSave,
])

intInput(companyListGotoPage, 1)
mobileInput(editCompanyListMobile)

document
  .querySelector("nav li[data-navitem='companyList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(companyListSearch)
    render()
  })

companyListSearch.addEventListener("input", () => {
  companyListGotoPage.value = 1
  render()
})

companyListSortBy.addEventListener("input", render)

companyListDisplayPerPage.addEventListener("input", () => {
  companyListGotoPage.value = 1
  render()
})

companyListGotoPage.addEventListener("keyup", render)

companyListGotoPage.addEventListener("blur", () => {
  companyListGotoPage.value > 0 ? "" : (companyListGotoPage.value = 1)
})

companyListCreate.addEventListener("click", () => {
  createCompany.classList.remove("hidden")
  createCompanyId.value = nextRowId("Companies")
  delayFocus(createCompanyName)
})

function clearEdit() {
  editCompanyListId.value = ""
  editCompanyListDue.value = ""
  editCompanyListName.value = ""
  editCompanyListRemark.value = ""
  editCompanyListMobile.value = ""

  editCompanyListOrderDaySaturday.checked = false
  editCompanyListOrderDaySunday.checked = false
  editCompanyListOrderDayMonday.checked = false
  editCompanyListOrderDayTuesday.checked = false
  editCompanyListOrderDayWednesday.checked = false
  editCompanyListOrderDayThusday.checked = false
  editCompanyListOrderDayFriday.checked = false

  editCompanyListDeliveryDaySaturday.checked = false
  editCompanyListDeliveryDaySunday.checked = false
  editCompanyListDeliveryDayMonday.checked = false
  editCompanyListDeliveryDayTuesday.checked = false
  editCompanyListDeliveryDayWednesday.checked = false
  editCompanyListDeliveryDayThusday.checked = false
  editCompanyListDeliveryDayFriday.checked = false

  editCompanyListTbody.innerHTML = ""
}

function updateEdit(id) {
  let company = getData("companies", `where id = ${id}`)

  let name = company.name
  let mobile = company.mobile
  let remark = company.remark
  let deus = company.dues
  let order_day = company.order_day.split(",")
  let delivery_day = company.delivery_day.split(",")

  // Clear previous data
  clearEdit()

  // Update with new data
  editCompanyListId.value = id
  editCompanyListName.value = name
  editCompanyListMobile.value = mobile
  editCompanyListRemark.value = remark
  editCompanyListDue.value = deus

  order_day.forEach(day => {
    switch (day) {
      case "Sat":
        editCompanyListOrderDaySaturday.checked = true
        break
      case "Sun":
        editCompanyListOrderDaySunday.checked = true
        break
      case "Mon":
        editCompanyListOrderDayMonday.checked = true
        break
      case "Tues":
        editCompanyListOrderDayTuesday.checked = true
        break
      case "Wed":
        editCompanyListOrderDayWednesday.checked = true
        break
      case "Thus":
        editCompanyListOrderDayThusday.checked = true
        break
      case "Fri":
        editCompanyListOrderDayFriday.checked = true
        break
    }
  })

  delivery_day.forEach(day => {
    switch (day) {
      case "Sat":
        editCompanyListDeliveryDaySaturday.checked = true
        break
      case "Sun":
        editCompanyListDeliveryDaySunday.checked = true
        break
      case "Mon":
        editCompanyListDeliveryDayMonday.checked = true
        break
      case "Tues":
        editCompanyListDeliveryDayTuesday.checked = true
        break
      case "Wed":
        editCompanyListDeliveryDayWednesday.checked = true
        break
      case "Thus":
        editCompanyListDeliveryDayThusday.checked = true
        break
      case "Fri":
        editCompanyListDeliveryDayFriday.checked = true
        break
    }
  })
}

companyListTbody.addEventListener("dblclick", e => {
  let tr = e.target.closest("tr")
  let id = Number(tr.dataset["id"])

  updateEdit(id)
  editCompanyList.classList.remove("hidden")
  delayFocus(editCompanyListName)
})

editCompanyListClose.addEventListener("click", () => {
  clearEdit()
  editCompanyList.classList.add("hidden")
})

editCompanyListClear.addEventListener("click", () => {
  updateEdit(Number(editCompanyListId.value))
  delayFocus(editCompanyListName)
})

editCompanyListSave.addEventListener("click", () => {
  let id = Number(editCompanyListId.value.trim())
  let dues = Number(editCompanyListDue.value.trim())
  let name = editCompanyListName.value.trim()
  let remark = editCompanyListRemark.value.trim()
  let mobile = editCompanyListMobile.value.trim()

  let orderDays = []
  let deliveryDay = []

  if (editCompanyListOrderDaySaturday.checked) orderDays.push("Sat")
  if (editCompanyListOrderDaySunday.checked) orderDays.push("Sun")
  if (editCompanyListOrderDayMonday.checked) orderDays.push("Mon")
  if (editCompanyListOrderDayTuesday.checked) orderDays.push("Tues")
  if (editCompanyListOrderDayWednesday.checked) orderDays.push("Wed")
  if (editCompanyListOrderDayThusday.checked) orderDays.push("Thus")
  if (editCompanyListOrderDayFriday.checked) orderDays.push("Fri")

  if (editCompanyListDeliveryDaySaturday.checked) deliveryDay.push("Sat")
  if (editCompanyListDeliveryDaySunday.checked) deliveryDay.push("Sun")
  if (editCompanyListDeliveryDayMonday.checked) deliveryDay.push("Mon")
  if (editCompanyListDeliveryDayTuesday.checked) deliveryDay.push("Tues")
  if (editCompanyListDeliveryDayWednesday.checked) deliveryDay.push("Wed")
  if (editCompanyListDeliveryDayThusday.checked) deliveryDay.push("Thus")
  if (editCompanyListDeliveryDayFriday.checked) deliveryDay.push("Fri")

  if (name.length === 0) {
    showMessege("Invalid company name", "Name must not empty!")
    delayFocus(editCompanyListName)
    return
  }

  if (mobile.length < 12) {
    showMessege("Invalid mobile no.", "Not a valid mobile no.")
    delayFocus(editCompanyListMobile)
    return
  }

  console.log(id)

  updateInto(
    "Companies",
    ["name", "mobile", "order_day", "delivery_day", "remark", "dues"],
    [name, mobile, orderDays.join(), deliveryDay.join(), remark, dues],
    `Where id = ${id}`
  )

  // Update dues infos

  showMessege(
    "Successfully Updated",
    `Company Id: ${Number(editCompanyListId.value)}`
  )

  clearEdit()
  editCompanyList.classList.add("hidden")

  render()
  delayFocus(companyListSearch)
})
