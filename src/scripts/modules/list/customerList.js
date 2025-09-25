import { delayFocus } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { enterToNextInput } from "../../utils/utils.js"
import { mobileInput } from "../../utils/utils.js"
import { updateInto } from "../../utils/database.js"
import { nextRowId } from "../../utils/database.js"
import { getData } from "../../utils/database.js"
import { showMessege } from "../../utils/messege.js"

function getCustomers(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  switch (sortBy) {
    case "name":
      stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(name) ASC`)
      break
    case "name_des":
      stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(name) DESC`)
      break
    case "id":
      stmt = db.prepare(`SELECT * from Customers ORDER BY id`)
      break
    case "id_des":
      stmt = db.prepare(`SELECT * from Customers ORDER BY id DESC`)
      break
    case "mobile":
      stmt = db.prepare(`SELECT * from Customers ORDER BY mobile`)
      break
    case "mobile_des":
      stmt = db.prepare(`SELECT * from Customers ORDER BY mobile DESC`)
      break
    case "address":
      stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(address)`)
      break
    case "address_des":
      stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(address) DESC`)
      break
    case "remark":
      stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(remark)`)
      break
    case "remark_des":
      stmt = db.prepare(`SELECT * from Customers ORDER BY UPPER(remark) DESC`)
      break
    case "due":
      stmt = db.prepare(`SELECT * from Customers ORDER BY dues`)
      break
    case "due_des":
      stmt = db.prepare(`SELECT * from Customers ORDER BY dues DESC`)
      break

    default:
      stmt = db.prepare(`SELECT * from Customers ORDER BY id`)
  }

  const customers = stmt.all()
  db.close()

  return customers
}

function sanitize(searchTerm, customers) {
  let niddle

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  customers.forEach(customer => {
    if (customer.id === Number(searchTerm)) {
      exactMatch.add(customer)
      return
    }

    if (customer.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (customer.mobile.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (customer.address.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (customer.remark.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(customer)
      return
    }

    if (niddle.test(customer.name)) {
      possibleMatch.add(customer)
      return
    }

    if (niddle.test(customer.address)) {
      possibleMatch.add(customer)
      return
    }

    if (niddle.test(customer.remark)) {
      possibleMatch.add(customer)
      return
    }
  })

  return [...exactMatch, ...startsWith, ...possibleMatch]
}

export function render() {
  let searchTerm = customerListSearch.value.trim()
  let display_per_page = Number(customerListDisplayPerPage.value)
  let sortBy = customerListSortBy.value

  const allSortedData = sanitize(searchTerm, getCustomers(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)

  customerListPossiblePage.innerHTML = possiblePage
  customerListGotoPage.value > possiblePage
    ? (customerListGotoPage.value = possiblePage)
    : ""

  let goto_page = Number(customerListGotoPage.value) || 1
  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ""

  toRenderData.forEach((list, i) => {
    let hasDue = Number(list.dues) > 0

    htmlString += `
        <tr data-id="${list.id}">
          <td>${i + 1}</td>
          <td>${list.id}</td>
          <td>${list.name}</td>
          <td>${list.address}</td>
          <td>${list.mobile}</td>
          <td>${list.remark}</td>
          <td ${hasDue ? "style='background-color: #cc0000c0'" : ""}>${
      list.dues
    }</td>
        </tr>
      `
  })

  customerList.querySelector("tbody").innerHTML = ""
  customerList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([customerListSearch, customerListGotoPage, customerListSearch])
enterToNextInput([
  editCustomerListName,
  editCustomerListAddress,
  editCustomerListMobile,
  editCustomerListRemark,
  editCustomerListSave,
])
enterToNextInput([
  editCustomerListPay,
  editCustomerListDiscount,
  editCustomerListSave,
])

intInput(customerListGotoPage, 1)
intInput(editCustomerListPay, 0)
intInput(editCustomerListDiscount, 0)
mobileInput(editCustomerListMobile)

document
  .querySelector("nav li[data-navitem='customerList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(customerListSearch)
    render()
  })

customerListSearch.addEventListener("input", () => {
  customerListGotoPage.value = 1
  render()
})

customerListSortBy.addEventListener("input", render)

customerListDisplayPerPage.addEventListener("input", () => {
  customerListGotoPage.value = 1
  render()
})

customerListGotoPage.addEventListener("keyup", render)

customerListGotoPage.addEventListener("blur", () => {
  customerListGotoPage.value > 0 ? "" : (customerListGotoPage.value = 1)
})

customerListCreate.addEventListener("click", () => {
  createCustomer.classList.remove("hidden")
  createCustomerId.value = nextRowId("Customers")
  delayFocus(createCustomerName)
})

customerListTbody.addEventListener("click", e => {
  let tr = e.target.closest("tr")
  let id = Number(tr.dataset["id"])
  let customer = getData("Customers", `WHERE id = ${id}`)

  editCustomerListId.value = customer.id
  editCustomerListName.value = customer.name
  editCustomerListAddress.value = customer.address
  editCustomerListMobile.value = customer.mobile
  editCustomerListRemark.value = customer.remark
  editCustomerListDue.value = customer.dues

  editCustomerList.classList.remove("hidden")
})

editCustomerListClose.addEventListener("click", () => {
  editCustomerListPay.value = ""
  editCustomerListDiscount.value = ""
  editCustomerList.close()
})

editCustomerListCancel.addEventListener("click", () => {
  editCustomerListPay.value = ""
  editCustomerListDiscount.value = ""
  editCustomerList.close()
})

editCustomerListSave.addEventListener("click", () => {
  let id = Number(editCustomerListId.value.trim())
  let name = editCustomerListName.value.trim()
  let address = editCustomerListAddress.value.trim()
  let mobile = editCustomerListMobile.value.trim()
  let remark = editCustomerListRemark.value.trim()
  let pay = Number(editCustomerListPay.value.trim())
  let discount = Number(editCustomerListDiscount.value.trim())

  let customer = getData("Customers", `WHERE id = ${id}`)

  if (!name.length) {
    showMessege("Invalid name", "Name must not me empty")
    return
  }

  if (mobile.length < 12) {
    showMessege("Invalid mobile no.", "Pls. Enter a valid mobile number")
    return
  }

  if (customer.dues < pay + discount) {
    showMessege("Invalid values", "Pay & discount exceed dues")
    return
  }

  const { DatabaseSync } = require("node:sqlite")
  const db = new DatabaseSync("database.db")

  db.exec("BEGIN TRANSACTION")

  updateInto(
    "Customers",
    ["name", "address", "mobile", "remark", "dues"],
    [name, address, mobile, remark, customer.dues - pay - discount],
    `Where id = ${id}`
  )

  db.exec("COMMIT")

  showMessege(
    "Successfully Updated",
    `Customer Id: ${Number(editCustomerListId.value)}`
  )

  editCustomerList.close()
  render()
})
