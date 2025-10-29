import { insertInto } from "./utils/database.js"
import { nextRowId } from "./utils/database.js"
import { getData } from "./utils/database.js"
import { updateCash } from "./utils/database.js"
import { updateCompanyDue } from "./utils/database.js"
import { showMessege } from "./utils/messege.js"
import { getDate, setDate } from "./utils/dateTime.js"
import { padZero, intInput, floatInput } from "./utils/utils.js"
import { focus, delayFocus, focusToSelectAll } from "./utils/utils.js"
import { enterToNextInput } from "./utils/utils.js"
import { suggestionHandler } from "./utils/utils.js"

function getCompanies() {
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")

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

function companyNameSuggetionRenderer() {
  let searchTerm = purchaseCompanyName.value.trim()
  let companies = getCompanies()

  let toRenderCompanies = sanitizeCompanyName(searchTerm, companies)

  let txt = ""

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
  const { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  let company_id = purchaseCompanyNameSuggetions.dataset["id"]
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
    niddle = new RegExp(searchTerm, "i")
  } catch (err) {
    niddle = new RegExp("")
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

  let txt = ""
  let { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")

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

// ------------------------------------------------------------------------ //

let carts = []

function sanitizeCarts(carts) {
  let sanitizedCarts = []

  carts.forEach(cart => {
    sanitizedCarts.push({
      productID: cart.productID,
      qunatity: cart.quantity,
      purchasePrice: cart.purchasePrice,
      totalPurchasePrice: cart.totalPurchasePrice,
      vat: cart.vat,
      totalVat: cart.totalVat,
      tradePrice: cart.tradePrice,
      totalTradePrice: cart.totalTradePrice,
      sellPrice: cart.sellPrice,
      rackNo: cart.rackNo,
      expireDate: cart.expireDate,
    })
  })

  return sanitizedCarts
}

function resetPurchaseWindow() {
  resetProductInfo()
  carts = []
  setDate(purchaseInvoiceDate, new Date())
  purchaseCompanyName.value = ""
  purchaseInvoiceNo.value = ""
  purchaseTbody.innerHTML = ""
  purchaseTotalBill.value = "0.0"
  purchasePayableBill.value = "0"
  purchaseDiscount.value = "0"
  purchaseToPay.value = "0"
  purchasePaid.value = "0"
  purchaseDue.value = "0"
  purchaseCompanyNameSuggetions.dataset.id = "0"
}

function resetProductInfo() {
  purchaseProductName.value = ""
  purchaseProductQuantity.value = ""
  purchasePurchasePrice.value = ""
  purchaseTotalPurchasePrice.value = ""
  purchaseVat.value = ""
  purchaseTotalVat.value = ""
  purchaseTradePrice.value = ""
  purchaseTotalTradePrice.value = ""
  purchaseSellPrice.value = ""
  purchaseRackNo.value = ""

  setDate(purchaseExpireDate, new Date(Date.now() + 365 * 24 * 3600000))
  purchaseProductNameSuggetions.dataset.id = "0"
}

function updateTotalBill() {
  let totalBill = 0
  let payableBill = 0
  let toPay = 0
  let discount = Number(purchaseDiscount.value)
  let paid = Number(purchasePaid.value)
  let due = Number(purchaseDue.value)

  carts.forEach(cart => {
    totalBill += Number(cart.totalTradePrice)
  })

  totalBill = Number(totalBill.toFixed(4))
  payableBill = Number(totalBill.toFixed(0))
  toPay = Number(totalBill - discount).toFixed(0)
  paid = Number(paid.toFixed(0))
  due = Number((toPay - paid).toFixed(0))

  purchaseTotalBill.value = totalBill
  purchasePayableBill.value = payableBill
  purchaseToPay.value = toPay
  purchasePaid.value = paid
  purchaseDue.value = due

  if (totalBill === 0) {
    purchasePayableBill.value = 0
    purchaseDiscount.value = 0
    purchaseToPay.value = 0
    purchasePaid.value = 0
    purchaseDue.value = 0
  }
}

function updateTradePrice() {
  let purchasePrice = Number(purchasePurchasePrice.value)
  let vat = Number(purchaseVat.value)
  let totalPurchasePrice = Number(purchaseTotalPurchasePrice.value)
  let totalVat = Number(purchaseTotalVat.value)

  let tradePrice = Number((purchasePrice + vat).toFixed(4))
  let totalTradePrice = Number((totalPurchasePrice + totalVat).toFixed(4))

  purchaseTradePrice.value = tradePrice
  purchaseTotalTradePrice.value = totalTradePrice
}

function deleteProductFromList(prodIndex) {
  carts.splice(prodIndex, 1)
  renderTable()
  updateTotalBill()
}

function renderTable() {
  let txt = ""
  purchaseTbody.innerHTML = ""

  carts.forEach((cart, i) => {
    let currentDate = Date.now()
    let shortDated = currentDate + 90 * 24 * 3600000
    let expireDate = getDate(new Date(cart.expireDate))

    let expired = false
    let toExpire = false

    let expireMsg = ""
    let expireClassName = ""
    let sellMsg = ""
    let sellClassName = ""

    if (cart.expireDate < currentDate) expired = true
    if (cart.expireDate < shortDated) toExpire = true

    if (toExpire) {
      expireMsg = "Product Will be expired within 90 days."
      expireClassName = "warning"
    }

    if (expired) {
      expireMsg = "Product was expired."
      expireClassName = "error"
    }

    if (Number(cart.sellPrice) <= Number(cart.tradePrice)) {
      sellMsg = "Check your sell price again"
      sellClassName = "error"
    }

    txt += `
      <tr data-row-no="${i + 1}" 
          data-product-id="${cart.productID}" 
          data-product-name="${cart.productName}" 
          data-product-type="${cart.productType}" 
          data-quantity="${cart.qunatity}" 
          data-purchase-price="${cart.purchasePrice}" 
          data-total-purchase-price="${cart.totalPurchasePrice}" 
          data-vat="${cart.vat}" 
          data-total-vat="${cart.totalVat}" 
          data-trade-price="${cart.tradePrice}" 
          data-total-trade-price="${cart.totalTradePrice}" 
          data-sell-price="${cart.sellPrice}" 
          data-rack-no="${cart.rackNo}" 
          data-expire-date="${cart.expireDate}" 
        >
        <td>${padZero(i + 1)}</td>
        <td>[${cart.productType}] ${cart.productName}</td>
        <td>${padZero(cart.qunatity)}</td>
        <td>${cart.purchasePrice}</td>
        <td>${cart.vat}</td>
        <td>${cart.totalPurchasePrice}</td>
        <td>${cart.totalVat}</td>
        <td>${cart.tradePrice}</td>
        <td>${cart.totalTradePrice}</td>
        <td class="${sellClassName}" title="${sellMsg}">${cart.sellPrice}</td>
        <td>${cart.rackNo}</td>
        <td class="${expireClassName}" title="${expireMsg}">${expireDate}</td>
        <td>X</td>
      </tr>
    `
  })

  purchaseTbody.innerHTML = txt
}

enterToNextInput([
  purchaseCompanyName,
  purchaseInvoiceNo,
  purchaseProductName,
  purchaseProductQuantity,
  purchaseExpireDate,
  purchasePurchasePrice,
])

enterToNextInput([
  purchaseRackNo,
  purchaseSerialNo,
  purchaseSellPrice,
  purchaseAddProduct,
])

enterToNextInput([purchaseDiscount, purchasePaid, purchaseDue, purchaseSave])

focusToSelectAll([
  purchaseCompanyName,
  purchaseInvoiceNo,
  purchaseProductName,
  purchaseProductQuantity,
  purchasePurchasePrice,
  purchaseTotalPurchasePrice,
  purchaseVat,
  purchaseTotalVat,
  purchaseSellPrice,
  purchaseRackNo,
  purchaseDiscount,
  purchasePaid,
  purchaseDue,
])

purchaseClear.addEventListener("click", resetPurchaseWindow)

purchaseCompanyName.addEventListener("input", () => {
  companyNameSuggetionRenderer()
  resetProductInfo()
  purchaseInvoiceNo.value = ""
  setDate(purchaseInvoiceDate, new Date())
  purchaseTbody.innerHTML = ""

  purchaseTotalBill.value = "0.0"
  purchasePayableBill.value = "0"
  purchaseDiscount.value = "0"
  purchasePaid.value = "0"
  purchaseDue.value = "0"
})

purchaseProductQuantity.addEventListener("keyup", e => {
  let purchasePrice = purchasePurchasePrice.value.trim()
  let quantity = purchaseProductQuantity.value.trim()
  let vat = purchaseVat.value.trim()

  let pp = Number(purchasePrice)
  let qnt = Number(quantity)
  let v = Number(vat)

  if (purchasePrice !== "" || purchasePrice !== "0") {
    purchaseTotalPurchasePrice.value = Number((pp * qnt).toFixed(4))
  }

  if (vat !== "" || vat !== "0") {
    purchaseTotalVat.value = Number((v * qnt).toFixed(4))
  }

  updateTradePrice()
})

purchasePurchasePrice.addEventListener("keyup", e => {
  let qunatity = purchaseProductQuantity.value.trim()
  let purchasePrice = purchasePurchasePrice.value.trim()

  let qnt = Number(qunatity) ? Number(qunatity) : 1

  let pp = Number(purchasePrice)

  purchaseTotalPurchasePrice.value = Number((pp * qnt).toFixed(4))

  updateTradePrice()

  if (e.key === "Enter") {
    if (e.target.value === "" || e.target.value === "0")
      focus(purchaseTotalPurchasePrice)
    else focus(purchaseVat)
  }
})

purchaseVat.addEventListener("keyup", e => {
  let qunatity = purchaseProductQuantity.value.trim()
  let vat = purchaseVat.value.trim()

  let qnt = Number(qunatity) ? Number(qunatity) : 1
  let v = Number(vat)

  purchaseTotalVat.value = Number((v * qnt).toFixed(4))
  updateTradePrice()

  if (e.key === "Enter") {
    if (e.target.value === "" || e.target.value === "0") focus(purchaseTotalVat)
    else focus(purchaseRackNo)
  }
})

purchaseTotalPurchasePrice.addEventListener("keyup", e => {
  let qunatity = purchaseProductQuantity.value.trim()
  let totalPurchasePrice = purchaseTotalPurchasePrice.value.trim()

  let qnt = Number(qunatity) ? Number(qunatity) : 1
  let tpp = Number(totalPurchasePrice)
  let pp = Number(tpp / qnt)

  purchasePurchasePrice.value = Number(pp.toFixed(4))

  updateTradePrice()

  if (e.key === "Enter") focus(purchaseTotalVat)
})

purchaseTotalVat.addEventListener("keyup", e => {
  let qunatity = purchaseProductQuantity.value.trim()
  let totalVat = purchaseTotalVat.value.trim()

  let qnt = Number(qunatity) ? Number(qunatity) : 1

  let tv = Number(totalVat)
  let v = Number(tv / qnt)

  purchaseVat.value = Number(v.toFixed(4))

  updateTradePrice()

  if (e.key === "Enter") focus(purchaseRackNo)
})

purchaseAddProduct.addEventListener("click", () => {
  let companyID = Number(purchaseCompanyNameSuggetions.dataset.id)
  let productID = Number(purchaseProductNameSuggetions.dataset.id)
  let qunatity = Number(purchaseProductQuantity.value.trim())

  let purchasePrice = Number(purchasePurchasePrice.value.trim())
  let totalPurchasePrice = Number(purchaseTotalPurchasePrice.value.trim())
  let vat = Number(purchaseVat.value.trim())
  let totalVat = Number(purchaseTotalVat.value.trim())

  let tradePrice = Number(purchaseTradePrice.value.trim())
  let totalTradePrice = Number(purchaseTotalTradePrice.value.trim())
  let sellPrice = Number(purchaseSellPrice.value.trim())
  let rackNo = Number(purchaseRackNo.value.trim())
  let expireDate = purchaseExpireDate.valueAsNumber

  if (companyID <= 0) {
    showMessege("Invaild company name", "Select a company")
    delayFocus(purchaseCompanyName)
    return
  }

  if (productID <= 0) {
    showMessege("Invalid product name", "Select a product")
    delayFocus(purchaseProductName)
    return
  }

  if (qunatity < 1) {
    showMessege("Invalid product qunatity", "Enter product qunatity")
    delayFocus(purchaseProductQuantity)
    return
  }

  if (sellPrice <= 0) {
    showMessege("Invalid sell price", "Enter product sell price")
    delayFocus(purchaseSellPrice)
    return
  }

  let product = getData("Products", `WHERE id = ${productID}`)
  let type = getData("Types", `WHERE id = ${product.type_id}`)

  let productName = product.name
  let productType = type.name

  carts.push({
    productID,
    productName,
    productType,
    qunatity,
    purchasePrice,
    totalPurchasePrice,
    vat,
    totalVat,
    tradePrice,
    totalTradePrice,
    sellPrice,
    rackNo,
    expireDate,
  })

  resetProductInfo()
  renderTable()
  updateTotalBill()
  delayFocus(purchaseProductName, 300)
})

purchaseTbody.addEventListener("click", e => {
  let row = e.target.closest("tr")
  let closeBtn = row.querySelector("& > td:last-child")

  let rowNo = row.dataset.rowNo
  let productID = row.dataset.productId
  let productName = row.dataset.productName
  let productType = row.dataset.productType
  let quantity = row.dataset.quantity
  let purchasePrice = row.dataset.purchasePrice
  let totalPurchasePrice = row.dataset.totalPurchasePrice
  let vat = row.dataset.vat
  let totalVat = row.dataset.totalVat
  let tradePrice = row.dataset.tradePrice
  let totalTradePrice = row.dataset.totalTradePrice
  let sellPrice = row.dataset.sellPrice
  let rackNo = row.dataset.rackNo
  let expireDate = row.dataset.expireDate

  deleteProductFromList(rowNo - 1)

  if (e.target === closeBtn) return

  purchaseProductNameSuggetions.dataset.id = productID
  purchaseProductName.value = `[${productType}] ${productName}`
  purchaseProductQuantity.value = quantity
  purchasePurchasePrice.value = purchasePrice
  purchaseTotalPurchasePrice.value = totalPurchasePrice
  purchaseVat.value = vat
  purchaseTotalVat.value = totalVat
  purchaseTradePrice.value = tradePrice
  purchaseTotalTradePrice.value = totalTradePrice
  purchaseSellPrice.value = sellPrice
  purchaseRackNo.value = rackNo
  setDate(purchaseExpireDate, new Date(Number(expireDate)))
})

purchaseDiscount.addEventListener("keyup", updateTotalBill)
purchasePaid.addEventListener("keyup", updateTotalBill)
purchaseDue.addEventListener("keyup", updateTotalBill)

purchaseSave.addEventListener("click", () => {
  let cash = Number(getData("StoreInfo", "WHERE id = 1").cash) || 0
  let companyID = Number(purchaseCompanyNameSuggetions.dataset.id)
  let invoiceNo = purchaseInvoiceNo.value.trim()
  let invoiceDate = purchaseInvoiceDate.valueAsNumber

  let totalBill = purchaseTotalBill.value
  let payableBill = Number(purchasePayableBill.value)
  let discount = Number(purchaseDiscount.value)
  let toPay = Number(purchaseToPay.value)
  let paid = Number(purchasePaid.value)
  let dues = Number(purchaseDue.value)

  if (carts.length === 0) {
    showMessege("Could not add produt", "Select some product to add")
    delayFocus(purchaseProductName)
    return
  }

  if (purchaseID <= 0) {
    showMessege("Invalid Company Name", "Select a company")
    delayFocus(purchaseCompanyName)
    return
  }

  if (invoiceNo === "") {
    showMessege("Invalid invoice no", "")
    delayFocus(purchaseInvoiceNo)
    return
  }

  if (discount > toPay) {
    showMessege("Invalid discount value", "Check your discount amount")
    delayFocus(purchaseDiscount)
    return
  }

  if (paid > toPay) {
    showMessege("Invalid paid value", "Check your paid  amount")
    delayFocus(purchasePaid)
    return
  }

  if (cash < paid) {
    showMessege("Have not sufficient cash", `You have ${cash} Taka cash.`)
    return
  }

  updateCash(-paid)
  updateCompanyDue(companyID, dues)

  let paymentData = []

  if (paid > 0)
    paymentData.push({
      paid: paid,
      dateTime: new Date(),
    })

  let productData = sanitizeCarts(carts)

  let purchase_insert_info = insertInto(
    "Purchases",
    [
      "company_id",
      "invoice_no",
      "invoice_date",
      "total_bill",
      "payable_bill",
      "discount",
      "to_pay",
      "paid",
      "dues",
      "product_data",
      "payment_data",
    ],
    [
      companyID,
      invoiceNo,
      invoiceDate,
      totalBill,
      payableBill,
      discount,
      toPay,
      paid,
      dues,
      JSON.stringify(productData),
      JSON.stringify(paymentData),
    ]
  )

  carts.forEach(cart => {
    insertInto(
      "Stocks",
      [
        "product_id",
        "purchase_id",
        "quantity",
        "purchase_price",
        "sell_price",
        "expire_date",
        "rack_no",
      ],
      [
        cart.productID,
        purchase_insert_info.lastInsertRowid,
        cart.qunatity,
        cart.purchasePrice,
        cart.sellPrice,
        cart.expireDate,
        cart.rackNo,
      ]
    )
  })

  resetPurchaseWindow()
  showMessege(
    "Suucessfully Purchases",
    `Purchase ID: ${purchase_insert_info.lastInsertRowid}`
  )
})

let now = Date.now()

purchaseID.value = nextRowId("purchases")
setDate(purchaseInvoiceDate, new Date(now))
setDate(purchaseExpireDate, new Date(now + 365 * 24 * 3600000))

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
