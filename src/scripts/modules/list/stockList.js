import { padZero } from '../../utils/utils.js'
import { delayFocus } from '../../utils/utils.js'
import { intInput } from '../../utils/utils.js'
import { enterToNextInput } from '../../utils/utils.js'
import { getDate } from '../../utils/dateTime.js'

function getStocks() {
  const { DatabaseSync } = require('node:sqlite')
  let db = new DatabaseSync('database.db')
  let stmt = db.prepare(
    `SELECT 
        Stocks.id, 
        Stocks.quantity,
        Stocks.purchase_price, 
        Stocks.sell_price, 
        Stocks.expire_date,
        Stocks.purchase_id,
        Stocks.product_id,
        Products.name as prod_name,
        Companies.id as com_id,
        Companies.name as com_name,
        Generics.id as gen_id,
        Generics.name as gen_name,
        Types.id as type_id,
        Types.name as type_name FROM Stocks
        INNER JOIN Products ON Stocks.product_id = Products.id
        INNER JOIN Companies On Products.company_id = Companies.id
        INNER JOIN Generics On Products.generic_id = Generics.id
        INNER JOIN Types On Products.type_id = Types.id
        ORDER BY Products.id
        `
  )

  const stocks = stmt.all()
  db.close()

  return stocks
}

function combineSimilerProduct() {
  let stock = getStocks()
  let combined = {}

  stock.forEach(s => {
    if (combined[s.product_id]) {
      combined[s.product_id].totalQantity += s.quantity
      combined[s.product_id].prodList.push({
        purchaseId: s.purchase_id,
        purchasePrice: s.purchase_price,
        sellPrice: s.sell_price,
        expireDate: s.expire_date,
        quantity: s.quantity
      })
    } else {
      combined[s.product_id] = {
        prodId: s.product_id,
        prodName: s.prod_name,
        prodGenId: s.gen_id,
        prodGenName: s.gen_name,
        prodTypeId: s.type_id,
        prodTypeName: s.type_name,
        prodComId: s.com_id,
        prodComName: s.com_name,
        prodList: [
          {
            purchaseId: s.purchase_id,
            purchasePrice: s.purchase_price,
            sellPrice: s.sell_price,
            expireDate: s.expire_date,
            quantity: s.quantity
          }
        ],
        totalQantity: s.quantity
      }
    }
  })

  let combined_list = []

  for (let c in combined) combined_list.push(combined[c])
  return combined_list
}

function sortStock(stocks, sortBy) {
  switch (sortBy) {
    case 'product_name':
      stocks.sort((a, b) => a.prodName.localeCompare(b.prodName))
      break
    case 'product_name_des':
      stocks.sort((a, b) => b.prodName.localeCompare(a.prodName))
      break
    case 'generic_name':
      stocks.sort((a, b) => a.prodGenName.localeCompare(b.prodGenName))
      break
    case 'generic_name_des':
      stocks.sort((a, b) => b.prodGenName.localeCompare(a.prodGenName))
      break
    case 'company_name':
      stocks.sort((a, b) => a.prodComName.localeCompare(b.prodComName))
      break
    case 'company_name_des':
      stocks.sort((a, b) => b.prodComName.localeCompare(a.prodComName))
      break
    default:
      stocks.sort((a, b) => a.prodName.localeCompare(b.prodName))
      break
  }
  return stocks
}

function sanitize(searchTerm, stocks) {
  let niddle

  const exactMatch = new Set()
  const startsWith = new Set()
  const possibleMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, 'i')
  } catch (err) {
    niddle = new RegExp('')
  }

  stocks.forEach(stock => {
    if (stock.purchase_id === Number(searchTerm)) {
      exactMatch.add(stock)
      return
    }

    if (stock.prodName.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(stock)
      return
    }

    if (stock.prodComName.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(stock)
      return
    }

    if (stock.prodGenName.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(stock)
      return
    }

    if (niddle.test(stock.prodName)) {
      possibleMatch.add(stock)
      return
    }

    if (niddle.test(stock.prodComName)) {
      possibleMatch.add(stock)
      return
    }

    if (niddle.test(stock.prodGenName)) {
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

  const combinedProduct = combineSimilerProduct()
  const sanitizeProduct = sanitize(searchTerm, combinedProduct)
  const sortedStock = sortStock(sanitizeProduct, sortBy)

  const possiblePage = Math.ceil(sortedStock.length / display_per_page)

  stockListPossiblePage.innerHTML = possiblePage
  stockListGotoPage.value > possiblePage
    ? (stockListGotoPage.value = possiblePage)
    : ''

  let goto_page = Number(stockListGotoPage.value) || 1
  const toRenderData = sortedStock.slice(
    (goto_page - 1) * display_per_page,
    sortedStock.length <= goto_page * display_per_page
      ? sortedStock.length
      : goto_page * display_per_page
  )

  let htmlString = ''

  toRenderData.forEach((list, i) => {
    if (list.totalQantity <= 0) return

    let id = (goto_page - 1) * display_per_page + (i + 1)

    if (list.prodList.length === 1) {
      let is_toExpire =
        list.prodList[0].expire_date < Date.now() + 90 * 24 * 3600000
      let is_expired = list.prodList[0].expireDate < Date.now()
      if (is_expired) is_toExpire = false

      htmlString += `
        <tr data-productId="${list.prodId}" data-purchaseId="${
        list.prodList[0].purchaseId
      }">
          <td>${padZero(id)}</td>
          <td>${padZero(list.prodList[0].purchaseId)}</td>
          <td>${list.prodTypeName}</td>
          <td>${list.prodName}</td>
          <td>${list.prodGenName}</td>
          <td>${list.prodComName}</td>
          <td></td>
          <td>${list.prodList[0].quantity}</td>
          <td>${list.prodList[0].purchasePrice}</td>
          <td>${list.prodList[0].sellPrice}</td>
          <td
          ${
            is_toExpire
              ? "style='background-color: #948500f1' title='Product will be expire within 90 days'"
              : ''
          } 
          ${
            is_expired
              ? "style='background-color: #cc0000c0' title='Product is expired. Pls purge this product by simply click on the row.'"
              : ''
          }>
            ${getDate(new Date(list.prodList[0].expireDate))}
            </td>
        </tr>
      `
    } else {
      htmlString += `
        <tr data-productId="${list.prodId}">
          <td rowspan=${list.prodList.length + 1}>${padZero(id)}</td>
          <td>....</td>
          <td rowspan=${list.prodList.length + 1}>${list.prodTypeName}</td>
          <td rowspan=${list.prodList.length + 1}>${list.prodName}</td>
          <td rowspan=${list.prodList.length + 1}>${list.prodGenName}</td>
          <td rowspan=${list.prodList.length + 1}>${list.prodComName}</td>
          <td rowspan=${list.prodList.length + 1}>${list.totalQantity}</td>
          <td>....</td>
          <td>....</td>
          <td>....</td>
          <td>....</td>
        </tr>
      `

      for (let i = 0; i < list.prodList.length; i++) {
        let is_toExpire =
          list.prodList[i].expire_date < Date.now() + 90 * 24 * 3600000
        let is_expired = list.prodList[i].expireDate < Date.now()
        if (is_expired) is_toExpire = false

        htmlString += `
        <tr data-productId="${list.prodId}">

          <td>${padZero(list.prodList[i].purchaseId)}</td>
          <td>${list.prodList[i].quantity}</td>
          <td>${list.prodList[i].purchasePrice}</td>
          <td style="text-align: center; width: auto">${
            list.prodList[i].sellPrice
          }</td>
          <td style="text-align: center; width: 80px"
          ${
            is_toExpire
              ? "style='background-color: #948500f1' title='Product will be expire within 90 days'"
              : ''
          } 
          ${
            is_expired
              ? "style='background-color: #cc0000c0' title='Product is expired. Pls purge this product by simply click on the row.'"
              : ''
          }>
            ${getDate(new Date(list.prodList[i].expireDate))}
          </td>
        </tr>
      `
      }
    }
  })

  stockList.querySelector('tbody').innerHTML = ''
  stockList.querySelector('tbody').innerHTML = htmlString
}

enterToNextInput([stockListSearch, stockListGotoPage, stockListSearch])

intInput(stockListGotoPage, 1)

document
  .querySelector("nav li[data-navitem='stockList']")
  .closest('li')
  .addEventListener('click', () => {
    delayFocus(stockListSearch)
    render()
  })

stockListSearch.addEventListener('input', () => {
  stockListGotoPage.value = 1
  render()
})

stockListSortBy.addEventListener('input', render)

stockListDisplayPerPage.addEventListener('input', () => {
  stockListGotoPage.value = 1
  render()
})

stockListGotoPage.addEventListener('keyup', render)

stockListGotoPage.addEventListener('blur', () => {
  stockListGotoPage.value > 0 ? '' : (stockListGotoPage.value = 1)
})
