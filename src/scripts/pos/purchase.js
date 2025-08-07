import { insertInto } from '../utils/database.js'
import { nextRowId } from '../utils/database.js'
import { getData } from '../utils/database.js'
import { updateCash } from '../utils/database.js'
import { updateCompanyDue } from '../utils/database.js'
import { showMessege } from '../utils/messege.js'
import { getDate, setDate } from '../utils/dateTime.js'
import { floatInput, padZero } from '../utils/utils.js'
import { intInput } from '../utils/utils.js'
import { delayFocus, focus } from '../utils/utils.js'
import { enterToNextInput } from '../utils/utils.js'
import { suggestionHandler } from '../utils/utils.js'

let carts = []

function resetInput() {
  purchaseProductName.value = ''
  purchaseProductQuantity.value = ''
  purchasePurchasePrice.value = ''
  purchaseTotalPurchasePrice.value = ''
  purchaseVat.value = ''
  purchaseTotalVat.value = ''
  puechaseTradePrice.value = ''
  purchaseTotalTradePrice.value = ''
  purchaseSellPrice.value = ''
  purchaseRackNo.value = ''

  setDate(purchaseExpireDate, new Date(Date.now() + 365 * 24 * 3600000))
  purchaseProductNameSuggetions.dataset.id = '0'
}

function clear() {
  resetInput()
  purchaseCompanyName.value = ''
  purchaseInvoiceNo.value = ''
  purchaseInvoiceDate
  purchaseTbody.innerHTML = ''
  carts = []
  purchaseBill.value = '0.0'
  purchasePayable.value = '0'
  purchaseDiscount.value = '0'
  purchasePaid.value = '0'
  purchaseDue.value = '0'
  purchaseCompanyNameSuggetions.dataset.id = '0'
}

function getCompanies() {
  const { DatabaseSync } = require('node:sqlite')
  let db = new DatabaseSync('database.db')

  let stmt = db.prepare(`SELECT * from Companies ORDER BY UPPER(name)`)
  let companys = stmt.all()
  db.close()

  return companys
}

function sanitizeCompanyName(searchTerm, companys) {
  let niddle
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, 'i')
  } catch (err) {
    niddle = new RegExp('')
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

function companyNameSuggetionRenderer() {
  let searchTerm = purchaseCompanyName.value.trim()
  let companies = getCompanies()

  let toRenderCompanies = sanitizeCompanyName(searchTerm, companies)

  let txt = ''

  toRenderCompanies.forEach(company => {
    txt += `
      <div data-company-id="${company.id}">
        <span class="suggetionIdSpan">${company.id}</span>
        <span class="suggetionDataSpan">${company.name}</span>
      </div>
    `
  })

  purchaseCompanyNameSuggetions.innerHTML = txt
}

function getProducts() {
  const { DatabaseSync } = require('node:sqlite')
  let db = new DatabaseSync('database.db')
  let company_id = purchaseCompanyNameSuggetions.dataset['id']
  let stmt = db.prepare(
    `SELECT * from Products WHERE Company_id = ? ORDER BY UPPER(name)`
  )
  let products = stmt.all(company_id)
  db.close()

  return products
}

function sanitizeProductName(searchTerm, products) {
  let niddle
  const startsWith = new Set()
  const possibleNameMatch = new Set()

  try {
    niddle = new RegExp(searchTerm, 'i')
  } catch (err) {
    niddle = new RegExp('')
  }

  products.forEach(product => {
    if (product.id == searchTerm) {
      startsWith.add(product)
      return
    }

    if (product.name.toUpperCase().startsWith(searchTerm.toUpperCase())) {
      startsWith.add(product)
      return
    }

    if (niddle.test(product.name)) {
      possibleNameMatch.add(product)
      return
    }
  })

  const sanitized = [...startsWith, ...possibleNameMatch]

  return sanitized
}

function productNameSuggetionRenderer() {
  let searchTerm = purchaseProductName.value.trim()
  let products = getProducts()

  let toRenderProducts = sanitizeProductName(searchTerm, products)

  let txt = ''
  let { DatabaseSync } = require('node:sqlite')
  let db = new DatabaseSync('database.db')

  toRenderProducts.forEach(product => {
    let type = db
      .prepare(`select * from Types where id = ${product.type_id}`)
      .get()

    txt += `
      <div data-company-id="${product.id}">
        <span class="suggetionIdSpan">${product.id}</span>
        <span class="suggetionDataSpan">[${type.name}] > ${product.name}</span>
      </div>
    `
  })

  purchaseProductNameSuggetions.innerHTML = txt
  db.close()
}

function renderTable() {
  let txt = ''
  purchaseTbody.innerHTML = ''

  carts.forEach((cart, i) => {
    let currentDate = Date.now()
    let shortDated = currentDate + 90 * 24 * 3600000
    let expireDate = getDate(new Date(cart.expireDate))

    let expired = false
    let toExpire = false

    let expireMsg = ''
    let expireClassName = ''
    let sellMsg = ''
    let sellClassName = ''

    if (cart.expireDate < currentDate) expired = true
    if (cart.expireDate < shortDated) toExpire = true

    if (toExpire) {
      expireMsg = 'Product Will be expired within 90 days.'
      expireClassName = 'warning'
    }

    if (expired) {
      expireMsg = 'Product was expired.'
      expireClassName = 'error'
    }

    if (Number(cart.sellPrice) <= Number(cart.tradePrice)) {
      sellMsg = 'Check your sell price again'
      sellClassName = 'error'
    }

    txt += `
      <tr data-row-no="${i + 1}" 
          data-product-id="${cart.productID}" 
          data-product-name="${cart.productName}" 
          data-product-type="${cart.productType}" 
          data-quantity="${cart.qunatity}" 
          data-pp="${cart.pp}" 
          data-pp-all="${cart.ppAll}" 
          data-vat="${cart.vat}" 
          data-vat-all="${cart.vatAll}" 
          data-trade-price="${cart.tradePrice}" 
          data-trade-price-all="${cart.tradePriceAll}" 
          data-sell-price="${cart.sellPrice}" 
          data-rack-no="${cart.rackNo}" 
          data-expire-date="${cart.expireDate}" 
        >
        <td>${padZero(i + 1)}</td>
        <td>[${cart.productType}] ${cart.productName}</td>
        <td>${padZero(cart.qunatity)}</td>
        <td>${cart.pp}</td>
        <td>${cart.vat}</td>
        <td>${cart.ppAll}</td>
        <td>${cart.vatAll}</td>
        <td>${cart.tradePrice}</td>
        <td>${cart.tradePriceAll}</td>
        <td class="${sellClassName}" title="${sellMsg}">${cart.sellPrice}</td>
        <td>${cart.rackNo}</td>
        <td class="${expireClassName}" title="${expireMsg}">${expireDate}</td>
        <td>X</td>
      </tr>
    `
  })

  purchaseTbody.innerHTML = txt
}

function updateBill() {
  let discount = Number(purchaseDiscount.value)
  let totalBill = 0

  carts.forEach(cart => {
    totalBill += Number(cart.tradePriceAll)
  })

  let payable = totalBill - discount

  purchaseBill.value = totalBill.toFixed(2)
  purchasePayable.value = payable.toFixed(0)

  purchaseDue.value = (
    Number(purchasePayable.value) - Number(purchasePaid.value)
  ).toFixed(0)
}

function deleteProductFromList(prodIndex) {
  carts.splice(prodIndex, 1)
  renderTable()
  updateBill()
}

enterToNextInput([purchaseCompanyName, purchaseInvoiceNo, purchaseProductName])
enterToNextInput([
  purchaseProductName,
  purchaseProductQuantity,
  purchaseExpireDate,
  purchasePurchasePrice
])
enterToNextInput([purchaseVat, purchaseSellPrice])
enterToNextInput([
  purchaseTotalPurchasePrice,
  purchaseTotalVat,
  purchaseSellPrice
])
enterToNextInput([purchaseSellPrice, purchaseRackNo, purchaseAddProduct])
enterToNextInput([
  purchaseBill,
  purchaseDiscount,
  purchasePaid,
  purchaseDue,
  purchaseSave
])

purchasePurchasePrice.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    let value = e.target.value.trim()

    if (value === '' || value === '0') focus(purchaseTotalPurchasePrice)
    else focus(purchaseVat)
  }
})

suggestionHandler(
  purchaseCompanyName,
  purchaseCompanyNameSuggetions,
  companyNameSuggetionRenderer
)
suggestionHandler(
  purchaseProductName,
  purchaseProductNameSuggetions,
  productNameSuggetionRenderer
)

purchaseClear.addEventListener('click', clear)

purchaseCompanyName.addEventListener('input', () => {
  companyNameSuggetionRenderer()
  resetInput()
  purchaseTbody.innerHTML = ''
})

purchaseAddProduct.addEventListener('click', () => {
  let companyID = Number(purchaseCompanyNameSuggetions.dataset.id)
  let productID = Number(purchaseProductNameSuggetions.dataset.id)
  let qunatity = Number(purchaseProductQuantity.value.trim())

  let pp = Number(purchasePurchasePrice.value.trim()).toFixed(2)
  let ppAll = Number(purchaseTotalPurchasePrice.value.trim()).toFixed(2)
  let vat = Number(purchaseVat.value.trim()).toFixed(2)
  let vatAll = Number(purchaseTotalVat.value.trim()).toFixed(2)

  let tradePrice = Number(Number(pp) + Number(vat)).toFixed(2)
  let tradePriceAll = Number(Number(tradePrice) * qunatity).toFixed(2)
  let sellPrice = Number(purchaseSellPrice.value.trim()).toFixed(2)
  let rackNo = Number(purchaseRackNo.value.trim())

  let expireDate = purchaseExpireDate.valueAsNumber

  if (companyID <= 0) {
    showMessege('Invaild company name', 'Select a company')
    delayFocus(purchaseCompanyName)
    return
  }

  if (productID <= 0) {
    showMessege('Invalid product name', 'Select a product')
    delayFocus(purchaseProductName)
    return
  }

  if (qunatity < 1) {
    showMessege('Invalid product qunatity', 'Enter product qunatity')
    delayFocus(purchaseProductQuantity)
    return
  }

  if (pp <= 0) {
    showMessege('Invalid purchase price', 'Enter product purchase price')
    delayFocus(purchasePurchasePrice)
    return
  }

  if (sellPrice <= 0) {
    showMessege('Invalid sell price', 'Enter product sell price')
    delayFocus(purchaseSellPrice)
    return
  }

  let { DatabaseSync } = require('node:sqlite')
  let db = new DatabaseSync('database.db')
  let getProductStmt = `select * from Products where id = ${productID}`
  let product = db.prepare(getProductStmt).get()
  let getTypeStmt = `select * from Types where id = ${product.type_id}`
  let type = db.prepare(getTypeStmt).get()
  db.close()

  let productName = product.name
  let productType = type.name

  carts.push({
    productID,
    productName,
    productType,
    qunatity,
    pp,
    ppAll,
    vat,
    vatAll,
    tradePrice,
    tradePriceAll,
    sellPrice,
    rackNo,
    expireDate
  })

  resetInput()
  renderTable()
  updateBill()
  delayFocus(purchaseProductName, 300)
})

purchaseProductQuantity.addEventListener('keyup', e => {
  let qunatity = Number(purchaseProductQnt.value.trim())
  let pricePerPiece = Number(purchasePurchasePrice.value.trim())
  let varPerPiece = Number(purchaseVat.value.trim())

  if (qunatity === 0) qunatity = 1

  if (purchasePurchasePrice.value.trim() !== '')
    purchaseTotalPurchasePrice.value = pricePerPiece * qunatity
  if (purchaseVat.value.trim() !== '')
    purchaseTotalVat.value = varPerPiece * qunatity
})

purchasePurchasePrice.addEventListener('keyup', e => {
  if (purchasePurchasePrice.value.trim() === '' && e.key === 'Enter')
    purchasePurchasePrice.value = 0
  let pricePerPiece = Number(purchasePurchasePrice.value.trim())
  let qunatity = Number(purchaseProductQnt.value.trim())

  if (qunatity === 0) qunatity = 1

  purchaseTotalPurchasePrice.value = Number(
    (pricePerPiece * qunatity).toFixed(2)
  )
})

purchaseVat.addEventListener('keyup', e => {
  if (purchaseVat.value.trim() === '' && e.key === 'Enter')
    purchaseVat.value = 0
  let vatPerPiece = Number(purchaseVat.value.trim())
  let qunatity = Number(purchaseProductQnt.value.trim())

  if (qunatity === 0) qunatity = 1

  purchaseTotalVat.value = Number((vatPerPiece * qunatity).toFixed(2))
})

purchaseTotalPurchasePrice.addEventListener('keyup', e => {
  if (purchaseTotalPurchasePrice.value.trim() === '' && e.key === 'Enter')
    purchaseTotalPurchasePrice.value = 0

  let totalPrice = Number(purchaseTotalPurchasePrice.value.trim())
  let qunatity = Number(purchaseProductQnt.value.trim())

  if (qunatity === 0) qunatity = 1

  purchasePurchasePrice.value = Number((totalPrice / qunatity).toFixed(2))
})

purchaseTotalVat.addEventListener('keyup', e => {
  if (purchaseTotalVat.value.trim() === '' && e.key === 'Enter')
    purchaseTotalVat.value = 0
  let totalVat = Number(purchaseTotalVat.value.trim())
  let qunatity = Number(purchaseProductQnt.value.trim())

  if (qunatity === 0) qunatity = 1

  purchaseVat.value = Number((totalVat / qunatity).toFixed(2))
})

purchaseTbody.addEventListener('click', e => {
  let row = e.target.closest('tr')
  let closeBtn = row.querySelector('& > td:last-child')

  let rowNo = row.dataset.rowNo
  let productID = row.dataset.productId
  let productName = row.dataset.productName
  let productType = row.dataset.productType
  let quantity = row.dataset.quantity
  let pp = row.dataset.pp
  let ppAll = row.dataset.ppAll
  let vat = row.dataset.vat
  let vatAll = row.dataset.vatAll
  let tradePrice = row.dataset.tradePrice
  let tradePriceAll = row.dataset.tradePriceAll
  let sellPrice = row.dataset.sellPrice
  let rackNo = row.dataset.rackNo
  let expireDate = row.dataset.expireDate

  deleteProductFromList(rowNo - 1)

  if (e.target === closeBtn) return

  purchaseProductNameSuggetions.dataset.id = productID
  purchaseProductName.value = `[${productType}] ${productName}`
  purchaseProductQnt.value = quantity
  purchasePurchasePrice.value = pp
  purchaseVat.value = vat
  purchaseTotalPurchasePrice.value = ppAll
  purchaseTotalVat.value = vatAll
  purchaseSellPrice.value = sellPrice
  purchaseRackNo.value = rackNo
  setDate(purchaseExpireDate, new Date(Number(expireDate)))
})

purchaseDiscount.addEventListener('keyup', updateBill)
purchasePaid.addEventListener('keyup', updateBill)
purchaseDue.addEventListener('keyup', () => {
  let discount = Number(purchaseDiscount.value)
  let totalBill = 0

  carts.forEach(cart => {
    totalBill += cart.qunatity * cart.purchasePrice
  })

  let payable = totalBill - discount

  purchaseBill.value = totalBill.toFixed(1)
  purchasePayable.value = payable.toFixed(0)

  purchasePaid.value = (
    Number(purchasePayable.value) - Number(purchaseDue.value)
  ).toFixed(0)
})

purchaseSave.addEventListener('click', () => {
  let cash = Number(getData('StoreInfo', 'WHERE id = 1').cash) || 0
  let companyID = Number(purchaseCompanyNameSuggetions.dataset.id)
  let invoiceNo = purchaseInvoiceNo.value.trim()

  let totalBill = purchaseBill.value
  let payable = Number(purchasePayable.value)
  let discount = Number(purchaseDiscount.value)
  let paid = Number(purchasePaid.value)
  let dues = Number(purchaseDue.value)
  let date = purchaseInvoiceDate.dataset.value

  if (carts.length === 0) {
    showMessege('Could not add produt', 'Select some product to add')
    delayFocus(purchaseProductName)
    return
  }

  if (purchaseID <= 0) {
    showMessege('Invalid Company Name', 'Select a company')
    delayFocus(purchaseCompanyName)
    return
  }

  if (invoiceNo === '') {
    showMessege('Invalid invoice no', '')
    delayFocus(purchaseInvoiceNo)
    return
  }

  if (discount > payable) {
    showMessege('Invalid discount value', 'Check your discount amount')
    delayFocus(purchaseDiscount)
    return
  }

  if (paid > payable) {
    showMessege('Invalid paid value', 'Check your paid  amount')
    delayFocus(purchasePaid)
    return
  }

  if (cash < paid) {
    showMessege('Have not sufficient cash', `You have ${cash}Taka cash.`)
    return
  }

  updateCash(-paid)
  updateCompanyDue(companyID, dues)

  let purchase_insert_info = insertInto(
    'Purchases',
    [
      'company_id',
      'invoice_no',
      'total_bill',
      'discount',
      'payable',
      'paid',
      'dues',
      'date',
      'data'
    ],
    [
      companyID,
      invoiceNo,
      totalBill,
      discount,
      payable,
      paid,
      dues,
      date,
      JSON.stringify(carts)
    ]
  )

  carts.forEach(cart => {
    insertInto(
      'Stocks',
      [
        'product_id',
        'purchase_id',
        'quantity',
        'purchase_price',
        'sell_price',
        'expire_date',
        'rack_no'
      ],
      [
        cart.productID,
        purchase_insert_info.lastInsertRowid,
        cart.qunatity,
        cart.pp,
        cart.sellPrice,
        cart.expireDate,
        cart.rackNo
      ]
    )
  })

  clear()
  showMessege(
    'Suucessfully Purchases',
    `Purchase ID: ${purchase_insert_info.lastInsertRowid}`
  )
})

purchaseID.value = padZero(nextRowId('purchases'))
purchaseInvoiceDate.dataset.value = Date.now()
purchaseInvoiceDate.value = getDate(new Date(purchaseInvoiceDate.dataset.value))
setDate(purchaseExpireDate, new Date(Date.now() + 365 * 24 * 3600000))

intInput(purchaseProductQuantity, 1)
floatInput(purchasePurchasePrice, 0)
floatInput(purchaseTotalPurchasePrice, 0)
floatInput(purchaseVat, 0)
floatInput(purchaseTotalVat, 0)
floatInput(purchaseSellPrice, 0)

intInput(purchaseRackNo, 1)
intInput(purchaseDiscount, 0)
intInput(purchasePaid, 0)
intInput(purchaseDue, 0)
