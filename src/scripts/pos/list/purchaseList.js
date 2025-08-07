import { padZero } from "../../utils/utils.js"
import { delayFocus } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { enterToNextInput } from "../../utils/utils.js"
import { getDate } from "../../utils/dateTime.js"

function getPurchases(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  switch (sortBy) {
    case "company_name":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY UPPER(Companies.name)
        `
      )
      break
    case "company_name_des":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY UPPER(Companies.name) DESC
        `
      )
      break
    case "id":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY Purchases.id
        `
      )
      break
    case "id_des":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY Purchases.id DESC
        `
      )
      break

    case "date":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY Purchases.date
        `
      )
      break
    case "date_des":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY Purchases.date DESC
        `
      )
      break

    case "due":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY Purchases.dues
        `
      )
      break
    case "due_des":
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY Purchases.dues DESC
        `
      )
      break

    default:
      stmt = db.prepare(
        `SELECT 
        Purchases.id, 
        Purchases.invoice_no,
        Purchases.invoice_date,
        Purchases.total_bill, 
        Purchases.payable_bill, 
        Purchases.discount, 
        Purchases.to_pay, 
        Purchases.paid, 
        Purchases.dues, 
        Purchases.product_data, 
        Purchases.payment_data, 
        Companies.name as company_name from Purchases
        INNER JOIN Companies ON Companies.id = Purchases.company_id ORDER BY Purchases.id
        `
      )
  }

  const purchases = stmt.all()
  db.close()

  return purchases
}

function sanitize(searchTerm, purchases) {
  let niddle

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  purchases.forEach(purchase => {
    if (purchase.id === Number(searchTerm)) {
      exactMatch.add(purchase)
      return
    }

    if (
      purchase.company_name.toUpperCase().startsWith(searchTerm.toUpperCase())
    ) {
      startsWith.add(purchase)
      return
    }

    if (
      purchase.invoice_no.toUpperCase().startsWith(searchTerm.toUpperCase())
    ) {
      startsWith.add(purchase)
      return
    }

    if (niddle.test(purchase.company_name)) {
      possibleMatch.add(purchase)
      return
    }

    if (niddle.test(purchase.invoice_no)) {
      possibleMatch.add(purchase)
      return
    }
  })

  return [...exactMatch, ...startsWith, ...possibleMatch]
}

export function render() {
  let searchTerm = purchaseListSearch.value.trim()
  let display_per_page = Number(purchaseListDisplayPerPage.value)
  let sortBy = purchaseListSortBy.value

  const allSortedData = sanitize(searchTerm, getPurchases(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)

  purchaseListPossiblePage.innerHTML = possiblePage
  purchaseListGotoPage.value > possiblePage
    ? (purchaseListGotoPage.value = possiblePage)
    : ""

  let goto_page = Number(purchaseListGotoPage.value) || 1
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
          <td>${list.invoice_no}</td>
          <td>${list.company_name}</td>
          <td>${list.total_bill}</td>
          <td>${list.payable_bill}</td>
          <td>${list.discount}</td>
          <td>${list.to_pay}</td>
          <td>${list.paid}</td>
          <td ${hasDue ? "style='background-color: #cc0000c0'" : ""}>
            ${list.dues}
          </td>

          <td>${getDate(new Date(list.invoice_date))}</td>
        </tr>
      `
  })

  purchaseList.querySelector("tbody").innerHTML = ""
  purchaseList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([purchaseListSearch, purchaseListGotoPage, purchaseListSearch])
intInput(purchaseListGotoPage, 1)

document
  .querySelector("nav li[data-navitem='purchaseList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(purchaseListSearch)
    render()
  })

purchaseListSearch.addEventListener("input", () => {
  purchaseListGotoPage.value = 1
  render()
})

purchaseListSortBy.addEventListener("input", render)

purchaseListDisplayPerPage.addEventListener("input", () => {
  purchaseListGotoPage.value = 1
  render()
})

purchaseListGotoPage.addEventListener("keyup", render)

purchaseListGotoPage.addEventListener("blur", () => {
  purchaseListGotoPage.value > 0 ? "" : (purchaseListGotoPage.value = 1)
})

// customerListCreate.addEventListener("click", () => {
//   createCustomer.showModal()
//   createCustomerId.value = nextRowId("Customers")
//   delayFocus(createCustomerName)
// })

// customerListTbody.addEventListener("click", e => {
//   let tr = e.target.closest("tr")
//   let id = Number(tr.dataset["id"])
//   let tdatas = tr.querySelectorAll("td")

//   let name = tdatas[1].innerHTML
//   let address = tdatas[2].innerHTML
//   let mobile = tdatas[3].innerHTML
//   let remark = tdatas[4].innerHTML

//   editCustomerListId.value = id
//   editCustomerListName.value = name
//   editCustomerListAddress.value = address
//   editCustomerListMobile.value = mobile
//   editCustomerListRemark.value = remark
//   editCustomerList.showModal()
// })

// editCustomerListCancel.addEventListener("click", () => {
//   editCustomerList.close()
// })

// editCustomerListOk.addEventListener("click", () => {
//   try {
//     updateInto(
//       "Customers",
//       ["name", "address", "mobile", "remark"],
//       [
//         editCustomerListName.value.trim(),
//         editCustomerListAddress.value.trim(),
//         editCustomerListMobile.value.trim(),
//         editCustomerListRemark.value.trim(),
//       ],
//       `Where id = ${editCustomerListId.value.trim()}`
//     )

//     showMessege(
//       "Successfully Updated",
//       `Product Id: ${Number(editCustomerListId.value)}`
//     )

//     editCustomerList.close()
//     render()
//   } catch (err) {
//     console.dir(err)
//     showMessege("Cannot Updated", `One or Multiple value are Invalid`)
//   }
// })
