import { padZero } from "../../utils/utils.js"
import { delayFocus } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { enterToNextInput } from "../../utils/utils.js"
import { mobileInput } from "../../utils/utils.js"
import { updateInto, nextRowId } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

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
          <td>${padZero(list.id)}</td>
          <td>${list.name}</td>
          <td>${list.mobile}</td>
          <td>${list.order_day}</td>
          <td>${list.delivery_day}</td>
          <td>${list.remark}</td>
          <td ${hasDue ? "style='background-color: #ff000050'" : ""}>${
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
  editCompanyListMobile,
  editCompanyListOrderDay,
  editCompanyListDeliveryDay,
  editCompanyListRemark,
  editCompanyListOk,
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
  createCompany.showModal()
  createCompanyId.value = nextRowId("Companies")
  delayFocus(createCompanyName)
})

companyListTbody.addEventListener("click", e => {
  let tr = e.target.closest("tr")
  let id = Number(tr.dataset["id"])
  let tdatas = tr.querySelectorAll("td")

  let name = tdatas[1].innerHTML
  let mobile = tdatas[2].innerHTML
  let order_day = tdatas[3].innerHTML
  let delivery_day = tdatas[4].innerHTML
  let remark = tdatas[5].innerHTML

  editCompanyListId.value = id
  editCompanyListName.value = name
  editCompanyListMobile.value = mobile
  editCompanyListOrderDay.value = order_day
  editCompanyListDeliveryDay.value = delivery_day
  editCompanyListRemark.value = remark

  editCompanyList.showModal()
})

editCompanyListCancel.addEventListener("click", () => {
  editCompanyList.close()
})

editCompanyListOk.addEventListener("click", () => {
  try {
    updateInto(
      "Companies",
      ["name", "mobile", "order_day", "delivery_day", "remark"],
      [
        editCompanyListName.value.trim(),
        editCompanyListMobile.value.trim(),
        editCompanyListOrderDay.value.trim(),
        editCompanyListDeliveryDay.value.trim(),
        editCompanyListRemark.value.trim(),
      ],
      `Where id = ${editCompanyListId.value.trim()}`
    )

    showMessege(
      "Successfully Updated",
      `Company Id: ${Number(editCompanyListId.value)}`
    )

    editCompanyList.close()
    render()
  } catch (err) {
    showMessege("Cannot Updated", `One or Multiple value are Invalid`)
  }
})
