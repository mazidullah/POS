import { padZero } from "../../utils/utils.js"
import { delayFocus } from "../../utils/utils.js"
import { intInput } from "../../utils/utils.js"
import { enterToNextInput } from "../../utils/utils.js"
import { getDate } from "../../utils/dateTime.js"

function getStockes(sortBy) {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let stmt

  switch (sortBy) {
    case "product_name":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date,
        Stocks.purchase_id as pid,
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY UPPER(Products.name)
        `
      )
      break
    case "product_name_des":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid,
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY UPPER(Products.name) DESC
        `
      )
      break
    case "id":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid,
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY Stocks.id
        `
      )
      break
    case "id_des":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid, 
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY Stocks.id DESC
        `
      )
      break
    case "company_name":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid,
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY UPPER(Companies.name)
        `
      )
      break
    case "company_name_des":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid, 
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY UPPER(Companies.name) DESC
        `
      )
      break
    case "generic_name":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid, 
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY UPPER(Generics.name)
        `
      )
      break
    case "generic_name_des":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid, 
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY UPPER(Generics.name) DESC
        `
      )
      break
    case "expire_date":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid, 
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY Stocks.expire_date
        `
      )
      break
    case "expire_date_des":
      stmt = db.prepare(
        `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date, 
        Stocks.purchase_id as pid, 
        Products.name as pn,
        Companies.name as cn,
        Generics.name as gn from Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        ORDER BY Stocks.expire_date DESC
        `
      )
      break
  }

  const stocks = stmt.all()
  db.close()

  return stocks
}

function sanitize(searchTerm, stocks) {
  let niddle

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
  }

  stocks.forEach(stock => {
    if (stock.id === Number(searchTerm)) {
      exactMatch.add(stock)
      return
    }

    if (stock.pn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(stock)
      return
    }

    if (stock.gn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(stock)
      return
    }

    if (stock.cn.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(stock)
      return
    }

    if (niddle.test(stock.pn)) {
      possibleMatch.add(stock)
      return
    }

    if (niddle.test(stock.gn)) {
      possibleMatch.add(stock)
      return
    }

    if (niddle.test(stock.cn)) {
      possibleMatch.add(stock)
      return
    }
  })

  return [...exactMatch, ...startsWith, ...possibleMatch]
}

export function render() {
  let searchTerm = stockListSearch.value.trim()
  let display_per_page = Number(stockListDisplayPerPage.value)
  let sortBy = stockListSortBy.value

  const allSortedData = sanitize(searchTerm, getStockes(sortBy))
  const possiblePage = Math.ceil(allSortedData.length / display_per_page)

  stockListPossiblePage.innerHTML = possiblePage
  stockListGotoPage.value > possiblePage
    ? (stockListGotoPage.value = possiblePage)
    : ""

  let goto_page = Number(stockListGotoPage.value) || 1
  const toRenderData = allSortedData.slice(
    (goto_page - 1) * display_per_page,
    allSortedData.length <= goto_page * display_per_page
      ? allSortedData.length
      : goto_page * display_per_page
  )

  let htmlString = ""

  toRenderData.forEach(list => {
    let is_sp_error = list.sell_price < list.purchase_price
    let is_toExpire = list.expire_date < Date.now() + 90 * 24 * 3600000
    let is_expired = list.expire_date < Date.now()

    if (is_expired) is_toExpire = false

    htmlString += `
        <tr data-id="${list.id}">
          <td>${padZero(list.id)}</td>
          <td>${padZero(list.pid)}</td>
          <td>${list.pn}</td>
          <td>${list.gn}</td>
          <td>${list.cn}</td>
          <td>${list.quantity}</td>
          <td>${list.purchase_price}</td>
          <td>${list.sell_price}</td>
          <td ${
            is_toExpire
              ? "class='to-expire' title='Will be expired within 90 days'"
              : ""
          } ${
      is_expired
        ? "class='expired' title='This Item was expired. We should purge the item.'"
        : ""
    }>${getDate(new Date(list.expire_date))}</td>
        </tr>
      `
  })

  stockList.querySelector("tbody").innerHTML = ""
  stockList.querySelector("tbody").innerHTML = htmlString
}

enterToNextInput([stockListSearch, stockListGotoPage, stockListSearch])
// enterToNextInput([
//   editCustomerListName,
//   editCustomerListAddress,
//   editCustomerListMobile,
//   editCustomerListRemark,
//   editCustomerListOk,
// ])

intInput(stockListGotoPage, 1)

document
  .querySelector("nav li[data-navitem='stockList']")
  .closest("li")
  .addEventListener("click", () => {
    delayFocus(stockListSearch)
    render()
  })

stockListSearch.addEventListener("input", () => {
  stockListGotoPage.value = 1
  render()
})

stockListSortBy.addEventListener("input", render)

stockListDisplayPerPage.addEventListener("input", () => {
  stockListGotoPage.value = 1
  render()
})

stockListGotoPage.addEventListener("keyup", render)

stockListGotoPage.addEventListener("blur", () => {
  stockListGotoPage.value > 0 ? "" : (stockListGotoPage.value = 1)
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
