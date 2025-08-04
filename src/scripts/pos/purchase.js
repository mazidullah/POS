import { insertInto } from "../utils/database.js"
import { nextRowId } from "../utils/database.js"
import { getData } from "../utils/database.js"
import { updateCash } from "../utils/database.js"
import { updateCompanyDue } from "../utils/database.js"
import { showMessege } from "../utils/messege.js"
import { getDate } from "../utils/dateTime.js"
import { floatInput, padZero } from "../utils/utils.js"
import { intInput } from "../utils/utils.js"
import { delayFocus } from "../utils/utils.js"
import { enterToNextInput } from "../utils/utils.js"
import { suggestionHandler } from "../utils/utils.js"

let carts = []

function clearAddProduct() {
  purchaseProductName.value = ""
  purchaseProductQnt.value = ""
  purchasePurchasePrice.value = ""
  purchaseVat.value = ""
  purchasePurchasePriceAll.value = ""
  purchaseVatAll.value = ""
  purchaseSellPrice.value = ""
  purchaseRackNo.value = ""
  purchaseExpireDate.value = plusOneYear()

  purchaseProductNameSuggetions.dataset.id = "0"
}

function clearAll() {
  clearAddProduct()
  purchaseTbody.innerHTML = ""
  purchaseCompanyName.value = ""
  purchaseInvoiceNo.value = ""
  purchaseCompanyNameSuggetions.dataset.id = "0"
  carts = []
  purchaseTotalBill.value = "0.0"
  purchasePayable.value = "0"
  purchaseDiscount.value = "0"
  purchasePaid.value = "0"
  purchaseDue.value = "0"
}

function plusOneYear(date = Date.now()) {
  let oneYear = 365 * 24 * 3600 * 1000
  let nextYear = new Date(date + oneYear)

  return `${nextYear.getFullYear()}-${padZero(
    nextYear.getMonth() + 1
  )}-${padZero(nextYear.getDate())}`
}

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

function renderTable() {
  let { DatabaseSync } = require("node:sqlite")
  let db = new DatabaseSync("database.db")
  purchaseTbody.innerHTML = ""
  let txt = ""

  carts.forEach((cart, i) => {
    let product = db
      .prepare(`select * from Products where id = ${cart.id}`)
      .get()
    txt += `
      <tr data-id=${cart.id}>
        <td>${padZero(i + 1)}</td>
        <td>${product.name}</td>
        <td>${padZero(cart.qunatity)}</td>
        <td>${cart.purchasePrice}</td>
        <td ${
          cart.sellPrice <= cart.purchasePrice
            ? "style='background-color: #cc00009d' title='Sell price is less then purchase price'"
            : ""
        }>${cart.sellPrice}</td>
        <td>${(cart.qunatity * cart.purchasePrice).toFixed(1)}</td>
        <td>${getDate(new Date(cart.expire))}</td>
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
    totalBill += cart.qunatity * cart.purchasePrice
  })

  let payable = totalBill - discount

  purchaseTotalBill.value = totalBill.toFixed(1)
  purchasePayable.value = payable.toFixed(0)

  purchaseDue.value = (
    Number(purchasePayable.value) - Number(purchasePaid.value)
  ).toFixed(0)
}

function deleteProductFromList(row) {
  let allRows = purchaseTbody.querySelectorAll("tr")
  let rowNo = -1

  allRows.forEach((r, i) => {
    if (r === row) rowNo = i
  })

  carts.splice(rowNo, 1)
  renderTable()
  updateBill()
}

enterToNextInput([purchaseCompanyName, purchaseInvoiceNo, purchaseProductName])
enterToNextInput([
  purchaseProductName,
  purchaseProductQnt,
  purchasePurchasePrice,
  purchaseVat,
  purchasePurchasePriceAll,
  purchaseVatAll,
  purchaseSellPrice,
  purchaseRackNo,
  purchaseExpireDate,
  purchaseAddProduct,
])
enterToNextInput([
  purchaseTotalBill,
  purchaseDiscount,
  purchasePaid,
  purchaseDue,
  purchaseSave,
])
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

delayFocus(purchaseCompanyName, 1000)
purchaseID.value = padZero(nextRowId("purchases"))
purchaseExpireDate.value = plusOneYear()
intInput(purchaseProductQnt, 1)
floatInput(purchasePurchasePrice, 0)
floatInput(purchasePurchasePriceAll, 0)
floatInput(purchaseVat, 0)
floatInput(purchaseVatAll, 0)
intInput(purchaseRackNo, 1)
intInput(purchaseDiscount, 0)
intInput(purchasePaid, 0)
intInput(purchaseDue, 0)

purchaseClear.addEventListener("click", clearAll)
purchaseCompanyName.addEventListener("input", () => {
  companyNameSuggetionRenderer()
  clearAddProduct()
  purchaseTbody.innerHTML = ""
})

purchaseAddProduct.addEventListener("click", () => {
  if (purchaseProductNameSuggetions.dataset.id <= 0) {
    showMessege("Error", "Invalid product name")
    delayFocus(purchaseProductName, 300)
    return
  }

  if (Number(purchaseProductQnt.value) < 1) {
    showMessege("Error", "Invalid product qunatity")
    delayFocus(purchaseProductQnt, 300)
    return
  }

  if (
    Number(purchasePurchasePrice.value) <= 0 &&
    Number(purchasePurchasePriceAll.value) <= 0
  ) {
    showMessege("Error", "Invalid purchase price")
    delayFocus(purchasePurchasePrice, 300)
    return
  }

  if (Number(purchaseSellPrice.value) < 1) {
    showMessege("Error", "Invalid sell price")
    delayFocus(purchaseSellPrice, 300)
    return
  }

  if (new Date(purchaseExpireDate.valueAsNumber).getTime() < Date.now()) {
    showMessege("Error", "Invalid expire date")
    delayFocus(purchaseExpireDate, 300)
    return
  }

  try {
    let productID = purchaseProductNameSuggetions.dataset.id
    let { DatabaseSync } = require("node:sqlite")
    let db = new DatabaseSync("database.db")
    let product = db
      .prepare(`select * from Products where id = ${productID}`)
      .get()
    db.close()

    let qunatity = Number(purchaseProductQnt.value)

    let purchasePrice =
      Number(purchasePurchasePrice.value) > 0
        ? Number(purchasePurchasePrice.value) * qunatity
        : Number(purchasePurchasePriceAll.value)

    let vat =
      Number(purchaseVat.value) > 0
        ? Number(purchaseVat.value) * qunatity
        : Number(purchaseVatAll.value)

    let totalPurchasePrice = Number(
      ((purchasePrice + vat) / qunatity).toFixed(2)
    )
    let sellPrice = Number(Number(purchaseSellPrice.value).toFixed(2))
    let rackNo = purchaseRackNo.value

    carts.push({
      id: product.id,
      qunatity: qunatity,
      purchasePrice: totalPurchasePrice,
      sellPrice: sellPrice,
      rackNo: rackNo,
      expire: purchaseExpireDate.valueAsNumber,
    })

    clearAddProduct()
    renderTable()
    updateBill()
    delayFocus(purchaseProductName, 300)
  } catch (err) {
    showMessege("Error", "Does not find the product. Pls Create new product")
    delayFocus(purchaseProductName)
  }
})
purchaseTbody.addEventListener("click", e => {
  let row = e.target.closest("tr")
  let productId = row.dataset.id

  if (e.target === row.querySelector("& > td:last-of-type")) {
    deleteProductFromList(row)
  } else {
    let { DatabaseSync } = require("node:sqlite")
    let db = new DatabaseSync("database.db")

    let product = db
      .prepare("select * from Products where id = ?")
      .get(productId)
    let type = db
      .prepare("select * from Types where id = ?")
      .get(product.type_id)

    db.close()

    purchaseProductNameSuggetions.dataset.id = productId
    purchaseProductName.value = `[${type.name}] > ${product.name}`
    purchaseProductQnt.value = row
      .querySelector("& > td:nth-child(3)")
      .innerHTML.trim()

    purchasePurchasePrice.value = row
      .querySelector("& > td:nth-child(4)")
      .innerHTML.trim()

    purchasePurchasePriceAll.value = ""
    purchaseVat.value = ""
    purchaseVatAll.value = ""

    purchaseSellPrice.value = row
      .querySelector("& > td:nth-child(5)")
      .innerHTML.trim()

    let dateArray = row
      .querySelector("& > td:nth-child(7)")
      .innerHTML.trim()
      .split("/")

    purchaseExpireDate.value = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`

    deleteProductFromList(row)
  }
})

purchaseDiscount.addEventListener("keyup", updateBill)
purchasePaid.addEventListener("keyup", updateBill)
purchaseDue.addEventListener("keyup", () => {
  let discount = Number(purchaseDiscount.value)
  let totalBill = 0

  carts.forEach(cart => {
    totalBill += cart.qunatity * cart.purchasePrice
  })

  let payable = totalBill - discount

  purchaseTotalBill.value = totalBill.toFixed(1)
  purchasePayable.value = payable.toFixed(0)

  purchasePaid.value = (
    Number(purchasePayable.value) - Number(purchaseDue.value)
  ).toFixed(0)
})

purchaseSave.addEventListener("click", () => {
  if (carts.length === 0) {
    showMessege("Opps...", "Pls. Select some product to save")
    return
  }

  if (Number(purchaseCompanyNameSuggetions.dataset.id) <= 0) {
    showMessege("Invalid Company Name", "Pls. Select a company")
    return
  }

  let company_id = Number(purchaseCompanyNameSuggetions.dataset.id).toFixed(0)
  let invoice_no = purchaseInvoiceNo.value.trim()

  let payable = Number(purchasePayable.value)
  let discount = Number(purchaseDiscount.value)
  let paid = Number(purchasePaid.value)
  let dues = Number(purchaseDue.value)

  let cash = Number(getData("StoreInfo", "WHERE id = 1").cash) || 0

  if (discount > payable) {
    showMessege("Invalid discount value", "Check your discount amount")
    return
  }

  if (paid > payable) {
    showMessege("Invalid paid value", "Check your paid  amount")
    return
  }

  if (cash < paid) {
    showMessege("Have not sufficient cash", `You have ${cash}Taka cash.`)
    return
  }

  updateCash(-paid)
  updateCompanyDue(company_id, dues)

  let purchase_insert_info = insertInto(
    "Purchases",
    [
      "company_id",
      "invoice_no",
      "date",
      "payable",
      "discount",
      "paid",
      "dues",
      "data",
    ],
    [
      company_id,
      invoice_no,
      new Date().getTime(),
      payable,
      discount,
      paid,
      dues,
      JSON.stringify(carts),
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
        cart.id,
        purchase_insert_info.lastInsertRowid,
        cart.qunatity,
        cart.purchasePrice,
        cart.sellPrice,
        cart.expire,
        cart.rackNo,
      ]
    )
  })

  clearAll()
  showMessege(
    "Suucessfully Purchases",
    `Purchase ID: ${purchase_insert_info.lastInsertRowid}`
  )

  console.log(
    getData("Purchases", `WHERE id = ${purchase_insert_info.lastInsertRowid}`)
  )
})
