import { delayFocus, intInput, enterToNextInput, mobileInput } from "../../utils/utils.js"
import { updateInto } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getCompanies(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  if (sortBy === "name_asc")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(name)`)
  else if (sortBy === "name_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(name) DESC`)
  else if (sortBy === "id_asc")
    stmt = db.prepare(`SELECT * from Companies ORDER BY id`)
  else if (sortBy === "id_des")
    stmt = db.prepare(`SELECT * from Companies ORDER BY id DESC`)

  const companys = stmt.all()
  db.close()
  return companys
}

function sanitize(searchTerm, companys) {
  let niddle
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  companys.forEach(company => {
    if (company.id == searchTerm) {
      startsWith.add(company)
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

  const sanitized = [...startsWith, ...possibleNameMatch]

  return sanitized
}

function render() {
  let searchTerm = companyListSearch.value.trim()
  let display_per_page = Number(companyListDisplayPerPage.value) || 100
  let goto_page = Number(companyListGotoPage.value) || 1
  let sortBy = companyListSortBy.value

  const allSortedData = sanitize(searchTerm, getCompanies(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)
  companyListPossiblePage.innerHTML = possiblePage

  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ""
  toRenderData.forEach(list => {
    htmlString += `
        <tr>
          <td>${list.id < 10 ? "0" + list.id : list.id}</td>
          <td>${list.name}</td>
          <td>${list.mobile || ""}</td>
          <td>${list.order_day || ""}</td>
          <td>${list.delivery_day || ""}</td>
          <td>${list.remark || ""}</td>
          <td>${list.dues || "0.0"}</td>
        </tr>
      `
  })

  companyList.querySelector("tbody").innerHTML = ""
  companyList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([companyListSearch, companyListGotoPage, companyListSearch])
enterToNextInput([editCompanyListName, editCompanyListMobile, editCompanyListOrderDay, editCompanyListDeliveryDay, editCompanyListRemark, editCompanyListOk])

mobileInput(editCompanyListMobile)
intInput(companyListDisplayPerPage)
intInput(companyListGotoPage)

document
  .querySelector("nav li[data-navitem='companyList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(companyListSearch)
    render()
  })

companyListSearch.addEventListener("input", render)
companyListSortBy.addEventListener("input", render)
companyListDisplayPerPage.addEventListener("keyup", render)
companyListGotoPage.addEventListener("keyup", render)
companyListDisplayPerPage.addEventListener("blur", () => {
  companyListDisplayPerPage.value > 0
    ? ""
    : (companyListDisplayPerPage.value = 100)
})
companyListGotoPage.addEventListener("blur", () => {
  companyListGotoPage.value > 0 ? "" : (companyListGotoPage.value = 1)
})

companyListTbody.addEventListener("click", e => {
  let tdatas = e.target.closest("tr").querySelectorAll("td")
  let id = Number(tdatas[0].innerHTML)
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
